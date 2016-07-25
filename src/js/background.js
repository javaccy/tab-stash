var c     = chrome;
var tab   = require('./lib/tab');
var stash = require('./lib/stash');
var utils = require('./lib/utils');
var st    = c.storage;
var conf  = require('./config.js');
var bookmarkConfig = conf.bookmark;

var background = {

    init: function() {
        var self = this;
        self.initOptions();
        self.bindEvents();
    },

    initOptions: function(){
        var self = this;
        st.sync.get(null, function(result){
            if(utils.isEmpty(result)){
                st.sync.set(conf, function () {
                    self.initStash(function () {
                        self.setBadgeText();
                    });
                });
            }else{
                self.initStash(function () {
                    self.setBadgeText();
                });
            }
        });
    },

    initStash: function(callback){
        var self = this;
        // 如果没有创建书签文件夹，先创建一个
        c.bookmarks.search({title: bookmarkConfig.title}, function (bookmark) {
            if(bookmark.length ===0){
                c.bookmarks.create({title: bookmarkConfig.title}, function(result){
                    bookmarkConfig.id = result.id;
                    st.sync.set({
                        bookmark: bookmarkConfig
                    }, function(){
                        console.log('set initial bookmarkConfig');
                        callback && callback();
                    });
                });
            }else{
                bookmark = bookmark[0];
                bookmarkConfig.id = bookmark.id;
                st.sync.set({
                    bookmark: bookmarkConfig
                }, function(){
                    console.log('otherwise');
                    callback && callback();
                });

            }
        });

    },

    setBadgeText: function(){
        stash.getAll(function(list){
            chrome.browserAction.setBadgeText({
                text: list.length + ''
            });
            chrome.browserAction.setBadgeBackgroundColor({
                color: conf.badge.color
            });
        });

    },
    bindEvents: function () {
        this.contextMenuEvent();
        this.bookmarkModifyEvent();
    },

    contextMenuEvent: function () {
        c.contextMenus.create({
            title: utils.getMsg('extMenuTitle'),
            contexts:['all'],
            onclick: function () {
                stash.create();
            }
        });
    },

    bookmarkModifyEvent: function(){
        var self = this;
        utils.afterBookmarkModify(function () {
            self.initOptions();
        });
    }
};

background.init();
