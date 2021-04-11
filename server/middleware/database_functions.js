const { DocDB } = require("aws-sdk");
const Database = require('better-sqlite3')
// var db = Database('./server/database/beavdms.db')

exports.createDatabase = function(db) {

    db.exec("CREATE TABLE IF NOT EXISTS Profiles (ProfileID INTEGER PRIMARY KEY, Hash TEXT NOT NULL)");

    db.exec("CREATE TABLE IF NOT EXISTS Users (UserID INTEGER PRIMARY KEY, Name TEXT, Email TEXT UNIQUE NOT NULL, ProfileID INTEGER, " +
        "FOREIGN KEY(ProfileID) REFERENCES Profiles(ProfileID) ON UPDATE CASCADE ON DELETE CASCADE)");

    db.exec("CREATE TABLE IF NOT EXISTS Groups (GroupID INTEGER PRIMARY KEY, Name TEXT NOT NULL, OwnerID INTEGER NOT NULL, Description TEXT, " +
        "FOREIGN KEY(OwnerID) REFERENCES USERS(UserID) ON UPDATE CASCADE)");

    db.exec("CREATE TABLE IF NOT EXISTS usersXgroups (UGID INTEGER PRIMARY KEY, UID INTEGER NOT NULL, GID INTEGER NOT NULL, FOREIGN KEY(UID) REFERENCES Users(UserID) " +
        "ON UPDATE CASCADE ON DELETE CASCADE, FOREIGN KEY (GID) REFERENCES Groups(GroupID) ON UPDATE CASCADE ON DELETE CASCADE)");

    db.exec("CREATE TABLE IF NOT EXISTS Projects (ProjID INTEGER PRIMARY KEY, Name TEXT NOT NULL, OwnerID INTEGER NOT NULL, ProjectCode INTEGER, Description TEXT, " +
        "FOREIGN KEY(OwnerID) REFERENCES Users(UserID) ON UPDATE CASCADE)");

    db.exec("CREATE TABLE IF NOT EXISTS Documents (DocID INTEGER PRIMARY KEY, Year INTEGER NOT NULL, Serial INTEGER NOT NULL, Name TEXT NOT NULL, Description TEXT, Location " +
        "TEXT NOT NULL, OwnerID INTEGER NOT NULL, Project INTEGER, DateAdded TEXT NOT NULL, Replaces INTEGER, ReplacedBy INTEGER, FOREIGN " +
        "KEY(Replaces) REFERENCES Documents(DocID), FOREIGN KEY(ReplacedBy) REFERENCES Documents(DocID), UNIQUE(Year, Serial), FOREIGN " +
        "KEY(OwnerID) REFERENCES Users(UserID) ON DELETE CASCADE, FOREIGN KEY(Project) REFERENCES Projects(ProjID) ON UPDATE CASCADE ON DELETE CASCADE)");

    db.exec("CREATE TABLE IF NOT EXISTS Notes (NoteID INTEGER PRIMARY KEY, DID INTEGER NOT NULL, UID INTEGER NOT NULL, DateAdded TEXT NOT NULL, " +
        "Note TEXT NOT NULL, FOREIGN KEY(DID) REFERENCES Documents(DocID) ON DELETE CASCADE, FOREIGN KEY(UID) REFERENCES Users(UserID) ON UPDATE " +
        "CASCADE ON DELETE CASCADE)");

    db.exec("CREATE TABLE IF NOT EXISTS DocPerms (PermID INTEGER PRIMARY KEY, DID INTEGER NOT NULL, UID INTEGER NOT NULL, Permissions " +
        "INTEGER NOT NULL, UNIQUE(DID, UID), FOREIGN KEY(DID) REFERENCES Documents(DocID) ON DELETE CASCADE, FOREIGN KEY(UID) REFERENCES Users(UserID) ON UPDATE " +
        "CASCADE ON DELETE CASCADE)");

    db.exec("CREATE TABLE IF NOT EXISTS ProjPerms (PermID INTEGER PRIMARY KEY, PID INTEGER NOT NULL, UID INTEGER NOT NULL, Permissions " +
        "INTEGER NOT NULL, UNIQUE(PID, UID), FOREIGN KEY(PID) REFERENCES Projects(ProjID) ON DELETE CASCADE, FOREIGN KEY(UID) REFERENCES Users(UserID) ON UPDATE " +
        "CASCADE ON DELETE CASCADE)");

    db.exec("CREATE TABLE IF NOT EXISTS GroupPerms (PermID INTEGER PRIMARY KEY, GID INTEGER NOT NULL, UID INTEGER NOT NULL, Permissions " +
        "INTEGER NOT NULL, UNIQUE(GID, UID), FOREIGN KEY(GID) REFERENCES Groups(GroupID) ON DELETE CASCADE, FOREIGN KEY(UID) REFERENCES Users(UserID) ON UPDATE " +
        "CASCADE ON DELETE CASCADE)");

    db.exec("CREATE TABLE IF NOT EXISTS ProjLinks (LinkID INTEGER PRIMARY KEY, PID INTEGER NOT NULL, Link TEXT NOT NULL, " +
        "FOREIGN KEY(PID) REFERENCES Projects(ProjID) ON DELETE CASCADE)");

    db.exec("CREATE TABLE IF NOT EXISTS DocLinks (LinkID INTEGER PRIMARY KEY, DID INTEGER NOT NULL, Link TEXT NOT NULL, " +
        "FOREIGN KEY(DID) REFERENCES Documents(DocID) ON DELETE CASCADE)");

    db.exec("CREATE TABLE IF NOT EXISTS Tags (TagID INTEGER PRIMARY KEY, Name TEXT UNIQUE NOT NULL)");

    db.exec("CREATE TABLE IF NOT EXISTS tagsXdocs (TDID INTEGER PRIMARY KEY, DID INTEGER NOT NULL, TID INTEGER NOT NULL, UNIQUE(DID, TID), FOREIGN KEY(DID) REFERENCES Documents(DocID) " +
        "ON UPDATE CASCADE ON DELETE CASCADE, FOREIGN KEY (TID) REFERENCES Tags(TagID) ON UPDATE CASCADE ON DELETE CASCADE)");
}