const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('.'));

app.post('/sos', async (req, res) => {
    const { contacts, location } = req.body;
    
    console.log('SOS Triggered!');
    console.log('Contacts:', contacts);
    console.log('Location:', location);
    
    res.json({ 
        success: true, 
        message: 'SOS received!' 
    });
});

app.listen(3000, () => {
    console.log('SafeHer Server running on port 3000!');
});