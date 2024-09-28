(function() {
  function getParticipantNames() {
    const participantNames = [];

    // Select the parent container with role="list" and aria-label="Teilnehmer" or "Anrufteilnehmer"
    const participantList = document.querySelector('div[role="list"][aria-label="Teilnehmer"], div[role="list"][aria-label="Anrufteilnehmer"]');

    if (participantList) {
      // Select all child elements with role="listitem"
      const participantItems = participantList.querySelectorAll('div[role="listitem"]');
      participantItems.forEach(item => {
        // Read the aria-label attribute of each listitem
        const name = item.getAttribute('aria-label');
        if (name) {
          participantNames.push(name.trim());
        }
      });
    } else {
      console.log('Teilnehmerliste nicht gefunden.');
    }

    return participantNames;
  }

  const names = getParticipantNames();

  chrome.runtime.sendMessage({ type: 'PARTICIPANT_NAMES', data: names });
})();
