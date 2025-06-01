const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    test('Solve a puzzle with a valid puzzle string', function() {
        chai.request(server).post('/api/solve')
            .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'solution');
            });
    });
    test('Solve a puzzle with missing puzzle string', function() {
        chai.request(server).post('/api/solve').send({ puzzle: '' })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: 'Required field missing' });
            });
    })
    test('Solve a puzzle with invalid characters', function() {
        chai.request(server).post('/api/solve').send({ puzzle: '1.5..2.84..63.12.7.2..5.....9,,1.m..8.2.3674.3.7.2..9.47...8..1..16....926n14.37.' })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
            });
    })
    test('Solve a puzzle with incorrect length', function() {
        chai.request(server).post('/api/solve').send({ puzzle: '1.5..2.84..63.12.7.2..5.....9,,1.m.' })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
            });
    })
    test('Solve a puzzle that cannot be solved', function() {
        chai.request(server).post('/api/solve').send({ puzzle: '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
            });
    })
    
    test('Check a puzzle placement with all fields', function() {
        chai.request(server).post('/api/check').send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A2', value: '3' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { valid: true });
            });
    })
    test('Check a puzzle placement with single placement conflict', function() {
        chai.request(server).post('/api/check').send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A2', value: '4' })
            .end((err, res) => {
                assert.deepEqual(res.body, { valid: false, conflict: ['row'] });
            });
    })
    test('Check a puzzle placement with multiple placement conflicts', function() {
        chai.request(server).post('/api/check').send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A2', value: '1' })
            .end((err, res) => {
                assert.deepEqual(res.body, { valid: false, conflict: ['row', 'region'] });
            });
    })
    test('Check a puzzle placement with all placement conflicts', function() {
        chai.request(server).post('/api/check').send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A2', value: '2' })
            .end((err, res) => {
                assert.deepEqual(res.body, { valid: false, conflict: ['row', 'column', 'region'] });
            });
    })
    test('Check a puzzle placement with missing required fields', function() {
        chai.request(server).post('/api/check').send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: 'Required field(s) missing' });
            });
    })
    test('Check a puzzle placement with invalid characters', function() {
        chai.request(server).post('/api/check').send({ puzzle: '1.5..2.84..63.12.7.2..5..b..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A2', value: '2' })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
            });
    })
    test('Check a puzzle placement with incorrect length', function() {
        chai.request(server).post('/api/check').send({ puzzle: '1.5..2.84..63.12.7.2..5..b..9..1....', coordinate: 'A2', value: '2' })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
            });
    })
    test('Check a puzzle placement with invalid placement coordinate', function() {
        chai.request(server).post('/api/check').send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A22', value: '2' })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: 'Invalid coordinate' });
            });
    })
    test('Check a puzzle placement with invalid placement value', function() {
        chai.request(server).post('/api/check').send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A2', value: '22' })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: 'Invalid value' });
            });
    })
});

