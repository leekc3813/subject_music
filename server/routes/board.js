const express = require('express');
const database = require('../config/database.config');

const authUtil = require('../middleware/auth').checkToken;

const router = express.Router();

router.post('/', async (req, res) => {
    let co;
    try {
        co = await database.getConnection();
        query = 'SELECT * FROM board_content';

        const [result] = await co.execute(query);
        console.log(result)
        co.release();
        return res.send(result);
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
})


router.post('/update', authUtil, async (req, res) => {
    let co;
    try {
        const { title, nickname, content, address1, address2, address3 } = req.body;
        const board_date = new Date();
        co = await database.getConnection();
        query = 'INSERT INTO board_content (title, nickname, content, address1, address2, address3,board_date) values (?,?,?,?,?,?,?)';
        values = [title, nickname, content, address1, address2, address3, board_date];

        await co.execute(query, values);
        co.release();

        return res.status(200).json({
            message: '성공'
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
})

router.post('/delete', authUtil, async (req, res) => {
    let co;
    try {
        const { id } = req.body;

        co = await database.getConnection();
        query = 'DELETE FROM board_content WHERE id = ?';
        values = [id];

        await co.execute(query, values);
        co.release();

        return res.status(200).json({
            message: '성공'
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
})

router.post('/search', authUtil, async (req, res) => {
    try {
        const co = await database.getConnection();
        query = '';
        values = [];

        const [result] = await co.execute(query, values);
        co.release();
        return res.send(result)
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
})

module.exports = router;
