const express = require('express')
const app = express()
const { v4: uuidv4 } = require('uuid')

const PORT = 3000

// Use middleware to parse JSON data
app.use(express.json());

// Basic array with the first envelop
const envelopes = 
[

    {
        id: uuidv4(),
        title: 'groceries',
        budget: 5000
    },

]

// Just a root directory in order to make sure all good
app.get('/', (req, res) => {
    res.send('I am the personal budget basic endpoint')
})

// Create envelope
app.post('/envelopes', (req, res) => {
    const { title, budget } = req.body

    if (!title || !budget) {
        res.status(400).send('Title and budget are required')
    }

    const newEnvelope = {
        id: uuidv4(), // Generate unique ID
        title,
        budget
    }

    envelopes.push(newEnvelope)
    res.status(200).json({
            message: 'Envelope added successfully',
            envelope: newEnvelope
        })
})

// Get all envelopes
app.get('/envelopes', (req, res) => {
    res.status(200).send(envelopes)
})

// Get envelope by specific ID
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

// Update existing envelope
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

// Delete envelope by specific ID
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

// This one to transfer budget from one envelope to another
app.put('/envelopes/transfer/:from/:to', (req, res) => {
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

// Start server
app.listen(PORT, () => {
    console.log('Server is working at http://localhost:' + PORT)
})