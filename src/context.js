import React from 'react';
const inboxMails = require('./jsons/inbox.json');
const spamMails = require('./jsons/spam.json');
const deletedMails = require('./jsons/deleted.json');
const sentMails = require('./jsons/sent.json');

const getUnReadInboxMails = inboxMails.filter(mail => mail['unread'] === true);
const getUnReadSpamMails = spamMails.filter(mail => mail['unread'] === true);

const flagedMails = [{type:'inbox', mId:'guid-1'}] ;

export const AppContext = React.createContext({
    selected: 'inbox', inboxTotalMails: 0, inboxUnreadMailsCount: getUnReadInboxMails.length, spamUnreadMailsCount: getUnReadSpamMails.length,
    inbox: inboxMails, spam: spamMails, deleted: deletedMails, sent: sentMails, flaged : flagedMails
});

export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;

