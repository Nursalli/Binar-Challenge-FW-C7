//Connect Models
const { User_games, User_game_biodata } = require('../models');

//Third-Party Module
const { Op } = require("sequelize");
const { validationResult } = require('express-validator');

//Handler
const index = async (req, res) => {
    const page = 'Biodata Users Page';
    const title = 'Biodata Users';

    const data = await User_game_biodata.findAll({});

    let checkData = await User_game_biodata.findAll({
        attributes: ['id_user']
    });

    checkData = checkData.map(i => i.id_user); 

    const checkDataUserGames = await User_games.findAll({
        where: {
            [Op.and] : {
                id: {
                    [Op.notIn] : checkData
                },
                role: {
                    [Op.ne] : 'Super User'
                }
            }
        }
    });

    res.render('dashboard/biodata-users', {
        layout: 'dashboard/layouts/main',
        page,
        title,
        data,
        checkDataUserGames,
        msg: req.flash('msg'),
        msgError: req.flash('msgError')
    });
}

const add = async (req, res) => {
    const page = 'Biodata Users Page';
    const title = 'Add Biodata Users';
    
    let data = await User_game_biodata.findAll({
        attributes: ['id_user']
    });

    data = data.map(i => i.id_user); 

    const dataUserGames = await User_games.findAll({
        where: {
            [Op.and] : {
                id: {
                    [Op.notIn] : data
                },
                role: {
                    [Op.ne] : 'Super User'
                }
            }
        }
    });

    if(Object.keys(dataUserGames).length > 0) {
        res.render('dashboard/add/add-biodata-user', {
            layout: 'dashboard/layouts/main',
            page,
            title,
            dataUserGames
        });
    } else {
        req.flash('msgError', 'All User Had Biodata!');
        res.redirect('/dashboard/biodata-users')
    }
}

const checkUser = (user_id) => {
    return User_games.findOne({
        where: {
            [Op.and] : {
                id: {
                    [Op.eq] : user_id
                },
                role: {
                    [Op.ne] : 'Super User'
                }
            }
        }
    })
}

const duplicateUserBiodata = (user_id) => {
    return User_game_biodata.findOne({
        where: {
            id_user : user_id
        }
    })
}

const duplicateEmailBiodata = (user_email) => {
    return User_game_biodata.findOne({
        where: {
            email : user_email
        }
    })
}

const duplicateEmailNewBiodata = (id, user_email) => {
    return User_game_biodata.findOne({
        where: {
            [Op.and] : {
                id: {
                    [Op.ne] : id
                },
                email: user_email
            }
        }
    })
}

const checkBirthdateBiodata = (user_birthdate) => {
    const dateInput = new Date(user_birthdate).toISOString().split('T')[0];
    const dateNow = new Date().toISOString().split('T')[0];

    if(dateInput > dateNow){
        return true;
    } else {
        return false;
    }
}

const addPost = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const page = 'Biodata Users Page';
        const title = 'Add Biodata Users';

        let data = await User_game_biodata.findAll({
            attributes: ['id_user']
        });
    
        data = data.map(i => i.id_user); 
    
        const dataUserGames = await User_games.findAll({
            where: {
                [Op.and] : {
                    id: {
                        [Op.notIn] : data
                    },
                    role: {
                        [Op.ne] : 'Super User'
                    }
                }
            }
        });

        res.render('dashboard/add/add-biodata-user', {
            layout: 'dashboard/layouts/main',
            page,
            title,
            dataUserGames,
            errors: errors.array()
        });
    } else {
        const country = req.body.country;

        let newData = {};

        if(country === ""){
            newData = {
                id_user: req.body.id_user,
                name: req.body.name,
                email: req.body.email,
                birthdate: req.body.birthdate
            }
        } else {
            newData = {
                id_user: req.body.id_user,
                name: req.body.name,
                email: req.body.email,
                birthdate: req.body.birthdate,
                country: req.body.country
            }
        }

        User_game_biodata.create(newData)
            .then((data) => {
                req.flash('msg', 'Data User Created!');
                res.redirect('/dashboard/biodata-users');
            });
    }
}

const edit = async (req, res) => {
    const page = 'Biodata Users Page';
    const title = 'Edit Biodata Users';

    let checkData = await User_game_biodata.findAll({
        attributes: ['id_user'],
        where: {
            id: {
                [Op.ne] : req.params.id
            }
        }
    });

    checkData = checkData.map(i => i.id_user);

    const dataUserGames = await User_games.findAll({
        where: {
            [Op.and] : {
                id: {
                    [Op.notIn] : checkData
                },
                role: {
                    [Op.ne] : 'Super User'
                }
            }
        }
    });

    const data = await User_game_biodata.findOne({
        where: {
            id: req.params.id
        }
    });

    res.render('dashboard/edit/edit-biodata-user', {
        layout: 'dashboard/layouts/main',
        page,
        title,
        dataUserGames,
        data
    });
}

const findUserBiodata = (id) => {
    return User_game_biodata.findOne({
        where: {
            id : id
        }
    })
}

const editPost = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const page = 'Biodata Users Page';
        const title = 'Edit Biodata Users';

        let checkData = await User_game_biodata.findAll({
            attributes: ['id_user'],
            where: {
                id: {
                    [Op.ne] : req.params.id
                }
            }
        });

        checkData = checkData.map(i => i.id_user);

        const dataUserGames = await User_games.findAll({
            where: {
                [Op.and] : {
                    id: {
                        [Op.notIn] : checkData
                    },
                    role: {
                        [Op.ne] : 'Super User'
                    }
                }
            }
        });

        res.render('dashboard/edit/edit-biodata-user', {
            layout: 'dashboard/layouts/main',
            page,
            title,
            errors: errors.array(),
            dataUserGames,
            data: {
                id: req.params.id,
                id_user: req.body.id_user,
                name: req.body.name,
                email: req.body.email,
                birthdateOld: req.body.birthdate,
                country: req.body.country
            }
        });
    } else {
        const country = req.body.country;

        let newData = {};

        if(country === ""){
            newData = {
                id_user: req.body.id_user,
                name: req.body.name,
                email: req.body.email,
                birthdate: req.body.birthdate,
                country: 'Indonesia'
            }
        } else {
            newData = {
                id_user: req.body.id_user,
                name: req.body.name,
                email: req.body.email,
                birthdate: req.body.birthdate,
                country: req.body.country
            }
        }

        User_game_biodata.update(newData, {
            where: {
                id:req.params.id
            }
        })
            .then((data) => {
                req.flash('msg', 'Data User Updated!');
                res.redirect('/dashboard/biodata-users');
            });
    }
}

const deletePost = async (req, res) => {
    const user = await findUserBiodata(req.params.id);
    
    if(user){
        User_game_biodata.destroy({
            where: {
                id: req.params.id
            }
        })
            .then((data) => {
                req.flash('msg', 'Biodata User Deleted!');
                res.redirect('/dashboard/biodata-users');
            });
    }else{
        req.flash('msgError', 'Biodata Not Found!');
        res.redirect('/dashboard/biodata-users');
    }
}

module.exports = { index, add, checkUser, duplicateUserBiodata, duplicateEmailBiodata, duplicateEmailNewBiodata, checkBirthdateBiodata, addPost, edit, findUserBiodata, editPost, deletePost }