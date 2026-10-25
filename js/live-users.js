// 60+ Fake Users Data
const fakeUsers = [
  { name: 'Rahul', avatar: 'https://i.pravatar.cc/100?img=1' },
  { name: 'Priya', avatar: 'https://i.pravatar.cc/100?img=5' },
  { name: 'Amit', avatar: 'https://i.pravatar.cc/100?img=11' },
  { name: 'Sneha', avatar: 'https://i.pravatar.cc/100?img=9' },
  { name: 'Vikram', avatar: 'https://i.pravatar.cc/100?img=12' },
  { name: 'Anjali', avatar: 'https://i.pravatar.cc/100?img=10' },
  { name: 'Rohit', avatar: 'https://i.pravatar.cc/100?img=13' },
  { name: 'Kavya', avatar: 'https://i.pravatar.cc/100?img=16' },
  { name: 'Suresh', avatar: 'https://i.pravatar.cc/100?img=15' },
  { name: 'Neha', avatar: 'https://i.pravatar.cc/100?img=20' }
];

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  // 1. Add Live Users Header (Top Left)
  const gameContainer = document.querySelector('.app') || document.querySelector('.main-area') || document.body;
  
  const usersPanel = document.createElement('div');
  usersPanel.className = 'live-users-container';
  
  let avatarsHTML = '<div class="live-avatars">';
  for(let i=0; i<3; i++) {
    avatarsHTML += `<img src="${fakeUsers[i].avatar}">`;
  }
  avatarsHTML += '</div>';
  
  const randomCount = Math.floor(Math.random() * 40) + 60; // 60 to 100
  usersPanel.innerHTML = `${avatarsHTML}<div class="live-count">${randomCount} Online</div>`;
  
  gameContainer.appendChild(usersPanel);

  // 2. Start fake betting simulation
  startFakeBets();

  // 3. Periodically clean up old fake chips (every 20 seconds)
  setInterval(() => {
    document.querySelectorAll('.fake-chip').forEach(chip => chip.remove());
  }, 20000);
});

function startFakeBets() {
  setInterval(() => {
    // Dono: Random user pick karo aur random bet amount
    const user = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
    const amounts = [10, 50, 100, 500];
    const betAmt = amounts[Math.floor(Math.random() * amounts.length)];
    
    // Game me bet zones dhundho (har game me class thodi alag hoti hai, toh hum broad search karenge)
    const betZones = document.querySelectorAll('.zone, .num-zone, .exact-zone, .bet-zone, .cell, .single-zone, .color-zone');
    
    if(betZones.length > 0) {
      // Random zone select karo
      const randomZone = betZones[Math.floor(Math.random() * betZones.length)];
      
      // Chip element create karo
      const chip = document.createElement('div');
      chip.className = `fake-chip c${betAmt}`;
      chip.textContent = betAmt;
      
      // Zone ke andar daal do
      randomZone.style.position = 'relative'; // Ensure relative positioning
      randomZone.appendChild(chip);
      
      // Show Live Feed Toast
      showLiveFeed(user.name, user.avatar, betAmt);
    }
  }, Math.random() * 2000 + 1500); // Har 1.5 se 3.5 second me ek bet
}

function showLiveFeed(name, avatar, amount) {
  const toast = document.createElement('div');
  toast.className = 'live-feed-toast';
  toast.innerHTML = `<img src="${avatar}"> <span><b>${name}</b> placed a bet of ₹${amount}</span>`;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
