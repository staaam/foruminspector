#!/usr/bin/perl

system "cat Board.js Category.js DisplayGeneral.js Forum.js ForumItem.js Post.js Main.js Topic.js > forumInspector.js";
system "cat forumInspectorHeader.xml forumInspector.js forumInspectorFooter.xml > forumInspectorOneFile.xml";
