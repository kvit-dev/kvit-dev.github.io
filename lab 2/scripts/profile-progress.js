document.addEventListener('DOMContentLoaded', function() {
  const gamesPlayed = parseInt(document.querySelector('.stats-grid .stats-card:nth-child(1) .stats-quantity').textContent);

  const gamesPerAward = 5;
  const nextAwardAt = (Math.floor(gamesPlayed / gamesPerAward) + 1) * gamesPerAward;
  const gamesNeeded = nextAwardAt - gamesPlayed;
  
  //calculation of the current progress percentage
  const progressSinceLastAward = gamesPlayed % gamesPerAward;
  const progressPercentage = (progressSinceLastAward / gamesPerAward) * 100;
  
  //a progress message
  const progressMessage = `You need ${gamesNeeded} more ${gamesNeeded === 1 ? 'game' : 'games'} to earn your next award`;
  
  const xpMessageElement = document.querySelector('.user-info p');
  xpMessageElement.textContent = progressMessage;
  
  const progressBar = document.querySelector('.progress');
  
  let progressFill = document.querySelector('.progress-fill');
  if (!progressFill) {
    progressFill = document.createElement('div');
    progressFill.className = 'progress-fill';
  
    progressFill.style.height = '100%';
    progressFill.style.width = '0%';
    progressFill.style.backgroundColor = 'rgb(45, 143, 176)';
    progressFill.style.borderRadius = '4px';
    progressFill.style.transition = 'width 1.5s ease-in-out';

    progressBar.appendChild(progressFill);
  }
  
  //label to show the games progress
  let progressLabel = document.querySelector('.progress-label');
  if (!progressLabel) {
    progressLabel = document.createElement('div');
    progressLabel.className = 'progress-label';
    
    progressLabel.style.position = 'absolute';
    progressLabel.style.top = '-22px';
    progressLabel.style.right = '0';
    progressLabel.style.fontSize = '14px';
    progressLabel.style.color = 'rgb(59, 59, 59)';
  
    progressBar.style.position = 'relative';
    progressBar.appendChild(progressLabel);
  }
  
  progressLabel.textContent = `${progressSinceLastAward}/${gamesPerAward} games`;
  
  //animate the progress fill after a short delay
  setTimeout(function() {
    progressFill.style.width = `${progressPercentage}%`;
  }, 300);
  
  //a tooltip
  progressBar.title = `${progressSinceLastAward} games played toward your next award. ${gamesNeeded} more needed.`;
  
  //a new section for award progress if it doesn't exist
  let awardProgressSection = document.querySelector('.award-progress');
  if (!awardProgressSection) {
    awardProgressSection = document.createElement('div');
    awardProgressSection.className = 'award-progress';
  
    const statsGrid = document.querySelector('.stats-grid');
    statsGrid.parentNode.insertBefore(awardProgressSection, statsGrid.nextSibling);
  }
});