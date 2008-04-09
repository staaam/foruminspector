#!/usr/bin/perl

system "cat Board.js Category.js CategoryDisplayItem.js DisplayGeneral.js DisplayItem.js Forum.js ForumItem.js ListDisplayItem.js Post.js Main.js Topic.js > forumInspector.js";
system "cat forumInspectorHeader.xml forumInspector.js forumInspectorFooter.xml > forumInspectorOneFile.xml";
