// Jab Admin Telegram se reply kare
socket.on('admin_reply', (msg) => {
  appendMessage(`👨‍💼 <b>Support:</b> ${msg}`, 'bot');
  beep();
});

let isTicketRaised = false;

function sendMessage(customText = null) {
  const input = document.getElementById('chatInput');
  const msgText = customText || input.value.trim();
  if (!msgText) return;
  
  appendMessage(msgText, 'user');
  if(!customText) input.value = '';

  const lower = msgText.toLowerCase().trim();

  // 1. AGENT TRANSFER (Agar user khud Agent mangaye)
  if (lower === 'agent' || lower === 'human' || lower === 'talk to agent') {
    socket.emit('user_message', { email: currentUser.email, message: msgText });
    appendMessage("⏳ <i>Connecting to Live Support Agent... Please wait.</i>", 'bot');
    return;
  }

  // 2. Bot typing animation start karo
  showTyping();
  
  setTimeout(() => {
    hideTyping();
    let reply = "";
    let showTicketBtn = false;

    // --- WITHDRAWAL RELATED ISSUES ---
    if (lower.includes('withdraw') || lower.includes('payout') || lower.includes('cashout')) {
      if (lower.includes('nahi') || lower.includes('pending') || lower.includes('kab') || lower.includes('tak') || lower.includes('time')) {
        reply = `<b>Withdrawal Pending? ⏳</b><br><br>` +
                `1️⃣ <b>Standard Time:</b> Withdrawals take <b>1 to 24 hours</b> to process.<br>` +
                `2️⃣ <b>Bank Holidays:</b> On Sundays & bank holidays, it may take up to 48 hours.<br>` +
                `3️⃣ <b>UPI Server:</b> Sometimes NPCI (UPI server) is down, causing delays.<br>` +
                `4️⃣ <b>KYC:</b> Ensure your account is fully verified.<br><br>` +
                `💡 <i>Your money is 100% safe. It will reach your bank soon.</i>`;
        showTicketBtn = true;
      } else {
        reply = `Withdrawal Rules:<br>• Minimum: ₹500<br>• Process: 1-24 hours.<br>Go to Wallet -> Withdraw to request.`;
      }
    }
    // --- DEPOSIT RELATED ISSUES ---
    else if (lower.includes('deposit') || lower.includes('add money') || lower.includes('recharge') || lower.includes('paisa')) {
      if (lower.includes('nahi') || lower.includes('pending') || lower.includes('kab') || lower.includes('tak') || lower.includes('hua') || lower.includes('failed')) {
        reply = `<b>Deposit Not Added? 💸</b><br><br>` +
                `1️⃣ <b>Server Delay:</b> Sometimes UPI takes 5-10 minutes to sync.<br>` +
                `2️⃣ <b>Deducted but not added:</b> Don't panic. If it failed, it will <b>auto-refund to your bank in 3-5 working days.</b><br>` +
                `3️⃣ <b>Pending Status:</b> Check Wallet -> History. If it's Pending, Admin is verifying it.<br><br>` +
                `💡 <i>Please share the screenshot of the transaction if you want faster resolution.</i>`;
        showTicketBtn = true;
      } else {
        reply = `To add money:<br>1. Go to Wallet -> Deposit.<br>2. Min ₹100.<br>3. Use UPI/Card.`;
      }
    }
    // --- KYC / VERIFICATION ---
    else if (lower.includes('kyc') || lower.includes('verify') || lower.includes('verification')) {
      reply = `<b>KYC Verification 🛡️</b><br>Currently, basic KYC is required only for withdrawals above ₹10,000. For normal withdrawals, just a valid UPI ID is needed.`;
    }
    // --- BALANCE ISSUE ---
    else if (lower.includes('balance') || lower.includes('wallet')) {
      if (lower.includes('nahi') || lower.includes('kam') || lower.includes('wrong')) {
        reply = `If your balance is wrong, please tap on the 'Raise Ticket' button below or share a screenshot. We will fix it in 10 minutes.`;
        showTicketBtn = true;
      } else {
        reply = `Your current balance is <b>₹${currentUser.balance}</b>. 💰`;
      }
    }
    // --- BASIC GREETINGS ---
    else if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey') || lower.includes('hii')) {
      reply = `Hello <b>${currentUser.name}</b>! 👋<br>Welcome to CroreBet Support. How can I help you today?`;
    } 
    else if (lower.includes('bonus') || lower.includes('offer') || lower.includes('promo')) {
      reply = `🎁 We have a <b>100% Welcome Bonus</b> up to ₹10,000 for new users on their first deposit! Check the Home page.`;
    } 
    else if (lower.includes('game') || lower.includes('play')) {
      reply = `🎮 We have 10+ games (Aviator, 7 Up Down, Roulette, etc). Go to Home to play!`;
    } 
    else if (lower.includes('refer') || lower.includes('friend')) {
      reply = `Invite friends and earn ₹100 per referral! Go to Wallet -> Refer & Earn for your code.`;
    } 
    else if (lower.includes('thank') || lower.includes('ok')) {
      reply = `You're welcome! 😊 Is there anything else I can help you with?`;
    } 
    // --- DEFAULT FALLBACK ---
    else {
      reply = `I'm not exactly sure what you mean. 🤔<br><br>` +
              `You can ask me about:<br>` +
              `• <b>"Withdraw nahi aaya"</b><br>` +
              `• <b>"Money add nahi hua"</b><br>` +
              `• <b>"Balance check"</b><br><br>` +
              `Or click the <b>"Live Agent"</b> button below to talk to a human.`;
    }

    // Agar issue type ka message hai toh Ticket button add karo
    if (showTicketBtn && !isTicketRaised) {
      reply += `<br><br><button class="bot-card-btn" style="background:#e53935;margin-top:8px;" onclick="raiseTicket()">🎫 Raise Support Ticket</button>`;
    } else if (showTicketBtn && isTicketRaised) {
      reply += `<br><br><i>✅ Your ticket is already active. Admin is looking into it.</i>`;
    }

    appendMessage(reply, 'bot');
  }, 1000); 
}

// Ticket Raise karne ka function
function raiseTicket() {
  if(isTicketRaised) {
    appendMessage("⚠️ You already have an active ticket. Please wait for the admin to reply here.", 'bot');
    return;
  }
  
  isTicketRaised = true;
  const ticketId = 'TKT' + Math.floor(100000 + Math.random() * 900000);
  
  // Telegram Admin ko alert bhejo
  socket.emit('user_message', { 
      email: currentUser.email, 
      message: `🚨 RAISED A SUPPORT TICKET (${ticketId}). Please check chat history.` 
  });
  
  appendMessage(`⏳ <i>Generating Ticket...</i>`, 'user');
  
  setTimeout(() => {
    appendMessage(`<b>✅ Ticket Created Successfully!</b><br><br>🎫 Ticket ID: <b>${ticketId}</b><br>⏱ Expected Reply: <b>Within 15-30 mins</b><br><br>Our team has been notified on Telegram. Please stay on this chat.`, 'bot');
    
    // Fake Admin reply after 10 seconds (Real feel ke liye)
    showTyping();
    setTimeout(() => {
      hideTyping();
      appendMessage(`👨‍💼 <b>Agent Rahul:</b> Hi ${currentUser.name}, I've received your ticket #${ticketId}. I am checking your account details. Please share the Transaction ID or screenshot if you have it. 📎`, 'bot');
    }, 10000);
  }, 1500);
}

function attachFile() { 
  appendMessage("📎 <i>[Screenshot uploaded]</i>", 'user'); 
  socket.emit('user_message', { email: currentUser.email, message: "[User uploaded a screenshot for support]" }); 
  setTimeout(() => appendMessage("✅ Screenshot received. Our team will verify and resolve your issue soon.", 'bot'), 1000);
}

function appendMessage(text, sender) {
  const chatBox = document.getElementById('chatMessages');
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const div = document.createElement('div');
  div.className = `message ${sender}`;
  div.innerHTML = `${text} <span class="time">${time}</span>`;
  chatBox.appendChild(div); 
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
  const chatBox = document.getElementById('chatMessages');
  let ind = document.getElementById('typingIndicator');
  if (!ind) { 
      ind = document.createElement('div'); 
      ind.id = 'typingIndicator'; 
      ind.className = 'typing-indicator'; 
      ind.innerHTML = '<span></span><span></span><span></span>'; 
      chatBox.appendChild(ind); 
  }
  ind.classList.add('show'); 
  chatBox.scrollTop = chatBox.scrollHeight;
}

function hideTyping() { 
    const ind = document.getElementById('typingIndicator'); 
    if(ind) ind.classList.remove('show'); 
}

function beep() { 
    try { 
        const ctx = new (window.AudioContext || window.webkitAudioContext)(); 
        const osc = ctx.createOscillator(); 
        osc.frequency.value = 800; 
        osc.connect(ctx.destination); 
        osc.start(); 
        osc.stop(ctx.currentTime + 0.1); 
    } catch(e){} 
}

document.addEventListener('DOMContentLoaded', () => { 
    document.getElementById('chatInput').addEventListener('keypress', (e) => { 
        if (e.key === 'Enter') sendMessage(); 
    }); 
});
