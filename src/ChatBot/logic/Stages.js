export const Stages = {
  WAITING: 0,
  ROLLING_BACK: 1,
  USER_STATUS: 2,
  ASK_HELP: 3,
  MAIN_HELP: 4,
  USER_QUESTIONS: 5,
  SEARCHING_QUESTIONS: 6,
  LISTS_QUESTIONS: 7,
};

export const stageManager = actionProvider => {
  const stageMap = new Map();

  stageMap.set(Stages.WAITING, message => {
    actionProvider.handleBackFromWaiting();
  });

  stageMap.set(Stages.ROLLING_BACK, message => {
    actionProvider.handleRollingBack();
  });

  stageMap.set(Stages.USER_STATUS, message => {
    let wordsList = message.split(' ');

    const positiveStatus = [
      'great',
      'good',
      'better',
      'fine',
      'excelent',
      'happy',
      'smile',
      'smiling',
      'perfect',
      'beautiful',
      'ok',
      'okey',
      'blessed',
      'awesome',
    ];

    const negativeStatus = [
      'bad',
      'stressed',
      'worst',
      'abysmal',
      'adverse',
      'angry',
      'annoy',
      'anxious',
      'evil',
      'hard',
      'hate',
      'banal',
      'callous',
      'clumsy',
      'suicide',
    ];

    for (const word of wordsList) {
      if (positiveStatus.includes(word)) {
        return actionProvider.handleUserStatus('good');
      } else if (negativeStatus.includes(word)) {
        return actionProvider.handleUserStatus('bad');
      }
    }

    return actionProvider.handleDontUnderstood(message, 'status');
  });

  stageMap.set(Stages.ASK_HELP, message => {
    let wordsList = message.split(' ');

    const positiveAnswer = [
      'yes',
      'please',
      'ok',
      'of',
      'course',
      'fast',
      'excelent',
      'thank',
      'you',
      'ready',
      'can',
    ];
    const negativeAnswer = [
      'no',
      "don't",
      'dont',
      'never',
      'hate',
      'stop',
      'cant',
      "can't",
    ];

    for (const word of wordsList) {
      if (positiveAnswer.includes(word)) {
        return actionProvider.handleMainHelp(true);
      } else if (negativeAnswer.includes(word)) {
        return actionProvider.handleMainHelp(false);
      }
    }

    return actionProvider.handleDontUnderstood(message, 'answer');
  });

  stageMap.set(Stages.MAIN_HELP, message => {
    if (message.includes('user')) {
      return actionProvider.userQuestions.handleUser();
    }

    return actionProvider.handleDontUnderstood(message);
  });

  stageMap.set(Stages.USER_QUESTIONS, message => {
    if (message.includes('sign')) {
      return actionProvider.userQuestions.handleSignIn();
    }
    if (message.includes('log')) {
      return actionProvider.userQuestions.handleLogIn();
    }
    if (message.includes('info')) {
      return actionProvider.userQuestions.handleMyInfo();
    }
  });

  stageMap.set(Stages.SEARCHING_QUESTIONS, message => {
    if (message.includes('search')) {
      return actionProvider.searchingQuestions.handleHowToSearch();
    }
    if (message.includes('types')) {
      return actionProvider.searchingQuestions.handleResultTypes();
    }
    if (message.includes('database')) {
      return actionProvider.searchingQuestions.handleMovieDatabase();
    }
  });

  return stageMap;
};

export default Stages;
