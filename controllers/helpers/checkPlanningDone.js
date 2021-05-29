function checkPlanningDone(panel) {
  // Diese Funktion prüft, ob die Planning-Phase beendet werden kann.
  // Sie kann abgeschlossen werden, wenn die Mindestanzahl an Stakeholdern
  // und mindestens eine Scale vorhanden sind.
  const { panel_stakeholders, panel_scales } = panel;

  let result = [];
  // in diesem Objekt werden die vorhandenen Staheholder gezählt
  let stakeholderCheckObject = {
    interviewer: 0,
    applicant: 0,
    council: 0,
    master: 0,
  };
  // definieren, wie viele Stakeholder mindestens benötigt werden
  const stakeholderRules = {
    applicant: 1,
    council: 0,
    master: 1,
    interviewer: 1,
  };
  const scaleRules = { scales: 1 };

  // Stakeholder zählen
  panel_stakeholders.forEach((stakeholder) => {
    stakeholderCheckObject[stakeholder.panel_role] += 1;
  });

  // Prüfen, ob je Kategorie genug Stakeholder vorhanden sind
  Object.keys(stakeholderRules).forEach((stakeholder) => {
    if (stakeholderRules[stakeholder] <= stakeholderCheckObject[stakeholder]) {
      // Object.assign(resultObject, {
      //   [stakeholder]: { passed: true, message: `${stakeholder} count ok` },
      // });
      result.push({
        entity: stakeholder,
        passed: true,
        count: stakeholderCheckObject[stakeholder],
        message: `${stakeholder} count ok`,
      });
    } else {
      // Object.assign(resultObject, {
      //   [stakeholder]: { passed: false, message: `${stakeholder} missing` },
      // });
      result.push({
        entity: stakeholder,
        passed: false,
        count: stakeholderCheckObject[stakeholder],
        message: `You need at least ${stakeholderRules[stakeholder]} ${
          stakeholderRules[stakeholder] === 1 ? stakeholder : stakeholder + 's'
        }`,
      });
    }
  });

  // Prüfen, ob genug Scales vorhanden sind
  if (scaleRules.scales <= panel_scales.length) {
    result.push({
      entity: 'scales',
      passed: true,
      count: panel_scales.length,
      message: 'scale count ok',
    });
  } else {
    result.push({
      entity: 'scales',
      passed: false,
      count: panel_scales.length,
      message: `You need at least ${scaleRules.scales} ${
        scaleRules.scales === 1 ? 'scale' : 'scales'
      }`,
    });
  }

  return result;
}

module.exports = checkPlanningDone;
