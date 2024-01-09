const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const { v4: uuidv4 } = require('uuid')

const PORT = 3000

const envelopes = 
[

    {
        id: uuidv4(),
        title: 'groceries',
        budget: 5000
    },

]
let nextEnvelopeId = Math.max(...envelopes.map(envelope => envelope.id))

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('I am the personal budget basic endpoint')
})

app.post('/envelopes', (req, res, next) => {
    const { title, budget } = req.body

    if (!title || !budget) {
        res.status(400).send('Title and budget are required')
    }

    nextEnvelopeId++;
    const newEnvelope = {
        id: uuidv4(),
        title,
        budget
    }

    envelopes.push(newEnvelope)
    res.status(200).json({
            message: 'Envelope added successfully',
            envelope: newEnvelope
        })
})

app.get('/envelopes', (req, res) => {
    res.status(200).send(envelopes)
})

app.get('/envelopes/:id', (req, res) => {
    const requestedId = req.params.id;

    const envelope = envelopes.find(envelope => envelope.id === requestedId);

    if (envelope) {
        res.status(200).json({
            message: envelope
        });
    } else {
        res.status(404).send('Not found envelope with id:' + requestedId)
    }
})

app.put('/envelopes/:id', (req, res) => {
    const requestedId = req.params.id;

    const envelopeIndex = envelopes.findIndex(envelope => envelope.id === requestedId);

    if (envelopeIndex !== -1) {
        const { title, budget } = req.body;

        if (title && budget) {
            envelopes[envelopeIndex] = {
                id: requestedId,
                title,
                budget
            };

            res.status(200).json({
                message: 'Envelope updated successfully',
                envelope: envelopes[envelopeIndex]
            });
        } else {
            res.status(400).send('Title and budget are required');
        }
    } else {
        res.status(404).send('Not found envelope with id:' + requestedId);
    }
});

app.delete('/envelopes/:id', (req, res) => {
    const requestedId = req.params.id;

    const envelopeIndex = envelopes.findIndex(envelope => envelope.id === requestedId);

    if (envelopeIndex !== -1) {
        envelopes.splice(envelopeIndex, 1);
        res.status(200).send('Deleted successfully');
    } else {
        res.status(404).send('Not found envelope with id:' + requestedId);
    }
});

app.put('/evelopes/transfer/:from/:to', (req, res) => {
    const fromEnvelope = req.params.from
    const toEnvelope = req.params.to

    const fromEnvelopeIndex = envelopes.findIndex(envelope => envelope.id === fromEnvelope)
    const toEnvelopeIndex = envelopes.findIndex(envelope => envelope.id === toEnvelope)

    if (fromEnvelopeIndex !== -1 && toEnvelopeIndex !== -1) {
        envelopes[toEnvelopeIndex].budget += envelopes[fromEnvelopeIndex].budget
        envelopes[fromEnvelopeIndex].budget = 0;
        res.status(200).json({
            message: 'Transfered succesfully',
            envelopes: envelopes.slice()
        });
    } else {
        res.status(404).send('One or both envelopes not found');
    }
})

app.listen(PORT, () => {
    console.log('Server is working at http://localhost:' + PORT)
})