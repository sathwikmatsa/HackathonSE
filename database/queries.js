const config = require("./../config");
const bcrypt = require('bcrypt');
const Pool = require('pg').Pool;
const pool = new Pool({
    user: config.db.user,
    host: config.db.host,
    database: config.db.database,
    password: config.db.password,
    port: config.db.port
});

const getUserByEmail = (email, callback) => {
    pool.query('SELECT * FROM person WHERE user_id = $1', [email], (error, results) => {
        if (error){
            throw error;
        }
        callback(results.rows[0]);
    })
}

const createUser = (request, response) => {
    const {email, password, fname, lname, phone, gender} = request.body;
    const age = parseInt(request.body.age);
    //TODO: refactor this piece
    getUserByEmail(email, (data) => {
        if (data){
            response.render('signup', {
                "error": "A user with that email already exists. Please try a different email, or <a href='/login'>log in</a> to your existing account."
            });
            return;
        }

        bcrypt.hash(password, 10, (err, hash) => {

            pool.query('INSERT INTO person (user_id, password, first_name, last_name, ph_no, age, gender, karma) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [email, hash, fname, lname, phone, age, gender, 100], (error, results) => {
                if (error) {
                    throw error;
                }
                response.redirect("/login");
            })
        });
    });
}

module.exports = {
  getUserByEmail,
  createUser
}
