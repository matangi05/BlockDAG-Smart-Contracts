// Voice recognition and keyword extraction for input.html

// Voice Recognition Setup
const speakBtn = document.getElementById('speakBtn');
const contractInput = document.getElementById('contractInput');
const speechStatus = document.getElementById('speechStatus');
let recognition;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  speakBtn.onclick = () => {
    recognition.start();
    speechStatus.textContent = 'Listening...';
    speakBtn.disabled = true;
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    contractInput.value = contractInput.value ? contractInput.value + ' ' + transcript : transcript;
    speechStatus.textContent = 'Speech captured!';
    speakBtn.disabled = false;
  };

  recognition.onerror = (event) => {
    speechStatus.textContent = 'Error: ' + event.error;
    speakBtn.disabled = false;
  };

  recognition.onend = () => {
    if (speechStatus.textContent === 'Listening...') {
      speechStatus.textContent = 'No speech detected.';
      speakBtn.disabled = false;
    }
  };
} else {
  speakBtn.disabled = true;
  speechStatus.textContent = 'Voice recognition not supported in this browser.';
}

// Replace the simple mock AI extraction function with a backend call
async function extractContractDetails(text) {
  // Call your backend
  const res = await fetch('http://localhost:3001/extract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) {
    alert('AI extraction failed');
    return {
      description: text,
      parties: '',
      deliverables: '',
      deadline: '',
      payment: '',
      milestones: '',
      penalties: ''
    };
  }
  return await res.json();
}


// Handle Next button
const nextBtn = document.getElementById('nextBtn');
nextBtn.onclick = async () => {
  const text = contractInput.value.trim();
  if (!text) {
    alert('Please enter or speak the contract terms.');
    return;
  }
  const extracted = await extractContractDetails(text);
  localStorage.setItem('contractDetails', JSON.stringify(extracted));
  window.location.href = 'contract.html';
}; 

const submitBtn = document.getElementById('submit-btn');
SubmitBtn.onclick = async () => {
  window.location.href = 'generate.html';
};

document.querySelector('.contract-form').addEventListener('submit', function(e) {
  e.preventDefault();
  // ... gather contractDetails ...
  localStorage.setItem('contractDetails', JSON.stringify(contractDetails));
  window.location.href = 'contractInteract.html';
});
