const db = require('../models');
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
    const limit = size? +size : 3;
    const offset = page? page * limit : 0;

    return { limit, offset };
}

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: tutorials } = data;
    const currentPage = page? +page : 0;
    const totalPages = Math.ceil(totalItems/limit);

    return { totalItems, tutorials, totalPages, currentPage };
}

// Create and Save a new Tutorial
exports.create = (req, res) => {
    if(!req.body.title) {
        res.status(400).send({
            message: 'Content can not be empty'
        });
        return;
    }

    const tutorial = {
        title: req.body.title,
        description: req.body.description,
        published: req.body.published? req.body.published : false 
    };

    Tutorial.create(tutorial)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occured while creating tutorial'
            });
        });
};

// Retrieve all tutorials from the database
exports.findAll = (req, res) => {
    const { page, size, title } = req.query;
    const condition = title? { title: { [Op.like] : `%${title}%` }} : null;

    const { limit, offset } = getPagination(page, size);

    Tutorial.findAndCountAll({ where: condition, limit, offset })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occured while retrieving tutorial'
            });
        });
};

// Find a single tutorial with id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Tutorial.findByPk(id)
        .then(data => {
            if(data) {
                res.send(data)
            } else {
                res.status(404).send({
                    message: `Could not find tutorial with id=${id}`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Error retrieving tutorial with id=${id}`
            });
        });
};

// Update tutorial by id 
exports.update = (req, res) => {
    const id = req.params.id;

    Tutorial.update(req.body, { where: { id : id } })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: 'Tutorial was updated successfully'
                });
            } else {
                res.send({
                    message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Error updating tutorial with id=${id}`
            });
        });
};

// Delete a tutorial with the specific id
exports.delete = (req, res) => {
    const id = req.params.id;

    Tutorial.destroy({
        where: {id:id}
    })
        .then(num => {
            if(num == 1) {
                res.send({
                    message: 'Tutorial was deleted successfully'
                });
            } else {
                res.send({
                    message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Could not delete Tutorial with id=${id}`
            });
        });
};

// Delete all tutorials
exports.deleteAll = (req, res) => {
    Tutorial.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({
                message: `${nums} tutorials are deleted successfully` 
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while removing all tutorials.'
            });
        });
};

// Find all published tutorials
exports.findAllPublished = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    Tutorial.findAndCountAll({ where: { published:true }, limit, offset})
        .then(data => {
            const response = getPagingData(data, page, limit)
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving tutorials.'
            });
        });
};

