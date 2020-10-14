const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// database connection
const mongoose = require('./db/mongoose');

// destination folder for storing excel sheets
const upload = multer({ dest: 'sheets/' });

const app = express();

const port = process.env.PORT || 4000;

const applicationCollection = require('./db/models/applications.model');

app.use(express.static(path.join(__dirname, 'dist/jobs')));

// a class to validate each row
class Application {
    constructor(obj) {
        this.applic = obj;
    }
    validateApplicaton() {
        let error = [];
        if (this.applic.username && String(this.applic.username).trim().length > 0) {
            if (String(this.applic.username).trim().replace(/[^a-zA-Z ]/g, "").length == 0) {
                error.push('NAME_INVALID');
            }
        } else {
            error.push('NAME_REQ');
        }
        if (this.applic.address && String(this.applic.address).trim().length > 0) {
            if (String(this.applic.address).trim().replace(/[^a-zA-Z ]/g, "").length == 0) {
                error.push('ADDR_INVALID');
            }
        } else {
            error.push('ADDR_REQ');
        }
        if (this.applic.city && String(this.applic.city).trim().length > 0) {
            if (String(this.applic.city).trim().replace(/[^a-zA-Z ]/g, "").length == 0) {
                error.push('CITY_INVALID');
            }
        } else {
            error.push('CITY_REQ');
        }
        if (this.applic.state && String(this.applic.state).trim().length > 0) {
            if (String(this.applic.state).trim().replace(/[^a-zA-Z ]/g, "").length == 0) {
                error.push('STATE_INVALID');
            }
        } else {
            error.push('STATE_REQ');
        }
        if (this.applic.country && String(this.applic.country).trim().length > 0) {
            if (String(this.applic.country).trim().replace(/[^a-zA-Z ]/g, "").length == 0) {
                error.push('COUNTRY_INVALID');
            }
        } else {
            error.push('COUNTRY_REQ');
        }
        if (this.applic.experience) {
            if (isNaN(Number(this.applic.experience))) {
                error.push('EXP_INVALID');
            }
        } else {
            error.push('EXP_REQ');
        }
        if (this.applic.salary) {
            if (isNaN(Number(this.applic.salary))) {
                error.push('SALARY_INVALID');
            }
        } else {
            error.push('SALARY_REQ');
        }
        return error;
    }
}

deletFile = (path) => {
    fs.unlinkSync(path, (err) => {
        if (err) {
            return false;
        }
        return true;
    });
    // return new Promise((resolve, reject) => {
    //     fs.unlinkSync(path, (err) => {
    //         if (err) {
    //           return false;
    //         }
    //         return true;
    //     });
    // });
}

app.post('/uploadSheet', upload.single('applications'), (req, res, next) => {
    // taking the file from front end
    try {
        if (!req.file) {
            // file not provided
            res.send({ status: false, code: -2, message: 'No file Found' });
        } else {
            next();
        }
    } catch (err) {
        res.send({ status: false, code: -1, message: 'error occurred while uploading file' });
    }
});

app.post('/uploadSheet', (req, res, next) => {
    const file = xlsx.readFile(req.file.path);
    const sheet = file.Sheets[file.SheetNames[0]];
    const columnCount = xlsx.utils.decode_range(sheet['!ref']).e.c + 1
    let expectedHeader = ['username', 'email', 'address', 'city', 'state', 'country', 'experience', 'salary'];
    let header = [];
    for (let i = 0; i < columnCount; ++i) {
        header[i] = sheet[`${xlsx.utils.encode_col(i)}1`].v
    }
    if (JSON.stringify(expectedHeader.sort()) != JSON.stringify(header.sort())) {
        // checking whether file consists required fields or not
        deletFile(req.file.path);
        res.send({ status: false, code: -3, message: 'Please provide all the required details' });
    } else {
        // converting excel to json
        let valid_emails = [];
        // the array above is used to store valid emails and will be sent to databse to check existing emails
        let status = [];
        // status of each row which consists of error codes
        const applications = xlsx.utils.sheet_to_json(sheet);
        // converting the sheet to json
        for (let index = 0; index < applications.length; index++) {
            let stat = { id: index, errors: [] };
            if (applications[index].email) {
                applications[index].email = applications[index].email.toLowerCase().trim();
                if (applications[index].email.length == 0) {
                    stat.errors.push('MAIL_REQ');
                } else {
                    if (valid_emails.findIndex(ob => ob == applications[index].email) >= 0) {
                        stat.errors.push('DUP_MAIL');
                    } else {
                        let exp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!exp.test(applications[index].email)) {
                            stat.errors.push('INVALID_MAIL');
                        } else {
                            valid_emails.push(applications[index].email);
                        }
                    }
                }
            } else {
                stat.errors.push('MAIL_REQ');
            }
            status.push(stat);
        }
        if (valid_emails.length === 0) {
            // if there are no valid mails in the data, then simply returning the status without going further
            deletFile(req.file.path);
            res.send({ status: true, code: 1, stats: status });
        } else {
            // checking existing mails in the database
            applicationCollection.find({ email: { $in: valid_emails } }, { email: 1 }, (err, data) => {
                if (err) {
                    deletFile(req.file.path);
                    res.send({ status: false, code: -4, message: 'Error occureed while searching for emails' });
                } else {
                    // filtering valid data thst needs to be saved
                    const all_mails = [];
                    const data_to_save = applications.filter((elem, index) => {
                        const appl_obj = new Application(elem);
                        const appl_errors = appl_obj.validateApplicaton();
                        status[index].errors.push(...appl_errors);
                        if (data.findIndex(ob => ob.email == elem.email) < 0 && all_mails.findIndex(ob => ob === elem.email) < 0 && valid_emails.findIndex(ob => ob == elem.email) >= 0) {
                            if (status[index].errors.length === 0) {
                                all_mails.push(elem.email);
                                return true;
                            }
                        } else {
                            if (valid_emails.findIndex(ob => ob == elem.email) >= 0 && status[index].errors.length == 0) {
                                status[index].errors.push('MAIL_EXIST');
                            }
                        }
                        return false;
                    });
                    if (data_to_save.length == 0) {
                        deletFile(req.file.path);
                        res.send({ status: true, code: 1, stats: status });
                    } else {
                        req.body.applications = data_to_save;
                        req.body.status = status;
                        next();
                    }
                }
            });
        }
    }
});

app.post('/uploadSheet', (req, res) => {
    applicationCollection.insertMany(req.body.applications, (err, data) => {
        if (err) {
            deletFile(req.file.path);
            res.send({ status: false, code: -5, message: 'Error occureed while saving the data' });
        } else {
            deletFile(req.file.path);
            res.send({ status: true, code: 1, stats: req.body.status });
        }
    });
});

app.get('/applications/:pagenum', (req, res) => {
    const page = (req.params.pagenum) ? req.params.pagenum : 0;
    const query = [{
        "$facet": {
            "applications": [
                { "$skip": (page - 1) * 10 },
                { "$limit": 10 }
            ],
            "count": [
                { "$count": "count" }
            ]
        }
    }];
    applicationCollection.aggregate(query, (err, data) => {
        if (err) {
            res.send({ status: false });
        } else {
            res.send({ status: true, current_page: page, applications: data[0].applications, total: data[0].count });
        }
    });
});

app.listen(port, () => {
    console.log("server is listening on port %d", port);
    console.log('restarted at ', new Date().toLocaleString());
});
