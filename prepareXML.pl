#!/usr/bin/perl

system "cat Board.js Category.js CategoryDisplayItem.js DisplayGeneral.js ForumDisplayItemSecondary.js DisplayItem.js Forum.js ForumItem.js ListDisplayItem.js Post.js Main.js Topic.js > forumInspector.js";
system "cat forumInspectorHeader.xml forumInspector.js forumInspectorFooter.xml > forumInspectorOneFile.xml";
system "svn commit -m\" \" --username kolmanv --password KJ8Zt5dU9RB8 "