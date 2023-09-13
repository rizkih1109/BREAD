const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(path.join(__dirname, 'db', 'data.db'))
const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    const { page = 1, name, height, weight, startdate, enddate, married, mode } = req.query
    const queries = []
    const params = []
    const limit = 5
    const offset = (page - 1) * 5

    if (name) {
        queries.push(`name like '%' || ? || '%'`)
        params.push(name)
    }

    if (height) {
        queries.push('height = ?')
        params.push(height)
    }

    if (weight) {
        queries.push('weight = ?')
        params.push(weight)
    }

    if (startdate && enddate) {
        queries.push(`birthdate BETWEEN ? and ?`)
        params.push(startdate, enddate)
    } else if (startdate) {
        queries.push('birthdate >= ?')
        params.push(startdate)
    } else if (enddate) {
        queries.push('birthdate <= ?')
        params.push(enddate)
    }

    if (married) {
        queries.push('married = ?')
        params.push(married)
    }

    let sql = 'SELECT * FROM data'
    if (queries.length > 0) {
        sql += ` where ${queries.join(` ${mode} `)}`
    }

    sql += ` LIMIT ? OFFSET ?`
    params.push(limit, offset)

    db.get('SELECT COUNT(*) AS total FROM data', (err, data) => {
        const total = data.total
        const pages = Math.ceil(total / limit)

        db.all(sql, params, (err, rows) => {
            if (err) return res.send(err)
            res.render('list', { data: rows, query: req.query, pages, offset, page, url: req.url })
        })
    })
})

app.get('/add', (req, res) => {
    res.render('add')
})

app.post('/add', (req, res) => {
    db.run('INSERT INTO data (name, height, weight, birthdate, married) values (?, ?, ?, ?, ?)', [req.body.name, req.body.height, req.body.weight, req.body.birthdate, req.body.married], (err) => {
        if (err) return res.send(err)
        res.redirect('/')
    })
})

app.get('/delete/:index', (req, res) => {
    db.run('DELETE FROM data WHERE id = ?', [req.params.index], (err) => {
        if (err) return res.send(err)
        res.redirect('/')
    })
})

app.get('/edit/:index', (req, res) => {
    const index = req.params.index
    db.get('SELECT * FROM data where id = ?', [index], (err, rows) => {
        if (err) return res.send(err)
        res.render('edit', { data: rows })
    })
})

app.post('/edit/:index', (req, res) => {
    db.run('UPDATE data SET name = ?, height = ?, weight = ?, birthdate = ?, married = ? WHERE id = ?', [req.body.name, req.body.height, req.body.weight, req.body.birthdate, req.body.married, req.params.index], (err) => {
        if (err) {
            console.log(err)
            return res.send(err)
        }
        res.redirect('/')
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})