// CONTACTS ARRAY
let contacts = [];

// WEB3FORMS ACCESS KEY
const ACCESS_KEY = "6d36ba69-7d95-4d9b-8af4-48cd3fc29156";

// ADD CONTACT FUNCTION
function addContact() {

    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const relation = document.getElementById('contactRelation').value;

    if (!name || !email) {
        alert('Please fill all fields!');
        return;
    }

    if (!email.includes('@')) {
        alert('Please enter valid email!');
        return;
    }

    contacts.push({ name, email, relation });

    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactRelation').value = '';

    displayContacts();

    localStorage.setItem('safeher_contacts', JSON.stringify(contacts));
}
// DISPLAY CONTACTS
function displayContacts() {
    const list = document.getElementById('contactsList');
    list.innerHTML = '';

    if (contacts.length === 0) {
        list.innerHTML = '<p style="color:#888; text-align:center">No contacts added yet</p>';
        return;
    }

    contacts.forEach((contact, index) => {
        list.innerHTML += `
            <div class="contact-card">
                <span>👤 ${contact.name}</span>
                <span>📞 ${contact.number}</span>
                <button class="delete-btn" onclick="deleteContact(${index})">🗑️</button>
            </div>
        `;
    });
}

// DELETE CONTACT
function deleteContact(index) {
    contacts.splice(index, 1);
    displayContacts();
    localStorage.setItem('safeher_contacts', JSON.stringify(contacts));
}

// LOAD CONTACTS
window.onload = function() {
    const saved = localStorage.getItem('safeher_contacts');
    if (saved) {
        contacts = JSON.parse(saved);
        displayContacts();
    }
}

// SOS FUNCTION
function triggerSOS() {
    if (contacts.length === 0) {
        alert('⚠️ Please add emergency contacts first!');
        return;
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const mapLink = `https://maps.google.com/?q=${lat},${lon}`;
                const time = new Date().toLocaleTimeString();
                

            document.getElementById("locText").innerHTML =
            "📍 Location: <a href='" + mapLink + "' target='_blank'>Open in Maps</a>";

            alert("SOS Alert Sent! Your location is ready to share.");


                sendEmergencyEmail(lat, lon,  mapLink, time);
            },
            function(error) {
                alert('⚠️ Location access denied!\nPlease enable location!');
            }
        );
    }
}

// SEND EMERGENCY EMAIL
async function sendEmergencyEmail(lat, lon, locationLink, time) {
    
    // SHOW SOS TRIGGERED
    document.querySelector('.sos-btn').innerHTML = '🚨';
    document.querySelector('.sos-btn').style.background = 'radial-gradient(circle, #ff6b6b, #ff0000)';

    let emailsSent = 0;

    for (const contact of contacts) {
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_key: ACCESS_KEY,
                    to: contact.number,
                    subject: '🚨 EMERGENCY ALERT - SafeHer',
                    message: `
🚨 EMERGENCY ALERT 🚨

${contact.name} - Your family member needs help!

📍 Location: ${locationLink}

⏰ Time: ${time}

Please respond immediately or call police!

112 - Police
108 - Ambulance

Sent via SafeHer App
                    `
                })
            });

            const data = await response.json();
            if (data.success) emailsSent++;

        } catch (error) {
            console.log('Email error:', error);
        }
    }

    // SHOW SUCCESS
    alert(`🚨 SOS TRIGGERED!\n\n✅ Alert sent to ${emailsSent} contacts!\n📍 Location shared!\n\n112 - Police\n108 - Ambulance`);

    // RESET BUTTON
    setTimeout(() => {
        document.querySelector('.sos-btn').innerHTML = 'SOS';
        document.querySelector('.sos-btn').style.background = 'radial-gradient(circle, #ff0000, #8b0000)';
    }, 3000);
}
// DARK/LIGHT MODE
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const btn = document.querySelector('.theme-btn');
    if (document.body.classList.contains('light-mode')) {
        btn.innerHTML = '☀️';
        localStorage.setItem('theme', 'light');
    } else {
        btn.innerHTML = '🌙';
        localStorage.setItem('theme', 'dark');
    }
}

// LOAD THEME
window.onload = function() {
    const saved = localStorage.getItem('safeher_contacts');
    if (saved) {
        contacts = JSON.parse(saved);
        displayContacts();
    }

    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        document.querySelector('.theme-btn').innerHTML = '☀️';
    }

}

