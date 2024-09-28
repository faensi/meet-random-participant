document.addEventListener('DOMContentLoaded', function () {
  const reloadBtn = document.getElementById('reloadBtn');
  const randomBtn = document.getElementById('randomBtn');
  const participantListDiv = document.getElementById('participantList');
  const resultDisplayDiv = document.getElementById('resultDisplay');

  reloadBtn.addEventListener('click', function () {
    participantListDiv.innerHTML = 'Loading...';
    resultDisplayDiv.textContent = '';

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          files: ['content.js'],
        },
        () => {
          if (chrome.runtime.lastError) {
            participantListDiv.textContent = `Error: ${chrome.runtime.lastError.message}`;
            return;
          }

          chrome.runtime.onMessage.addListener(function listener(message) {
            if (message.type === 'PARTICIPANT_NAMES') {
              chrome.runtime.onMessage.removeListener(listener);
              displayParticipantList(message.data);
            }
          });
        }
      );
    });
  });

  randomBtn.addEventListener('click', function () {
    const checkboxes = participantListDiv.querySelectorAll('input[type="checkbox"]:checked');
    const selectedNames = Array.from(checkboxes).map(cb => cb.value);

    if (selectedNames.length === 0) {
      resultDisplayDiv.textContent = 'Please select at least one participant.';
      return;
    }

    const randomName = selectedNames[Math.floor(Math.random() * selectedNames.length)];
    resultDisplayDiv.textContent = `Random Participant: ${randomName}`;
  });

  function displayParticipantList(names) {
    if (names.length === 0) {
      participantListDiv.textContent = 'No participants found.';
      return;
    }

    participantListDiv.innerHTML = '';
    names.forEach(name => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = name;
      checkbox.checked = true;

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(name));
      participantListDiv.appendChild(label);
    });
  }
});
