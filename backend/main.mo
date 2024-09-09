import Hash "mo:base/Hash";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Result "mo:base/Result";

actor {
  type Class = {
    id: Text;
    name: Text;
    description: Text;
    role: Text;
    image: Text;
  };

  stable var classesArray: [Class] = [];
  var likesDislikes = HashMap.HashMap<Text, (Nat, Nat)>(10, Text.equal, Text.hash);

  func addInitialClass(id: Text, name: Text, description: Text, role: Text, image: Text) {
    let newClass: Class = {
      id;
      name;
      description;
      role;
      image;
    };
    classesArray := Array.append(classesArray, [newClass]);
    likesDislikes.put(id, (0, 0));
  };

  public func addClass(id: Text, name: Text, description: Text, role: Text, image: Text) : async Result.Result<(), Text> {
    addInitialClass(id, name, description, role, image);
    #ok(())
  };

  public query func getClasses() : async [Class] {
    classesArray
  };

  public query func getClassDetails(classId: Text) : async Result.Result<Class, Text> {
    switch (Array.find<Class>(classesArray, func(c) { c.id == classId })) {
      case (?classData) { #ok(classData) };
      case (null) { #err("Class not found") };
    }
  };

  public func likeClass(classId: Text) : async Result.Result<(), Text> {
    switch (likesDislikes.get(classId)) {
      case (?counts) {
        let (likes, dislikes) = counts;
        likesDislikes.put(classId, (likes + 1, dislikes));
        #ok(())
      };
      case (null) { #err("Class not found") };
    }
  };

  public func dislikeClass(classId: Text) : async Result.Result<(), Text> {
    switch (likesDislikes.get(classId)) {
      case (?counts) {
        let (likes, dislikes) = counts;
        likesDislikes.put(classId, (likes, dislikes + 1));
        #ok(())
      };
      case (null) { #err("Class not found") };
    }
  };

  public query func getLikesDislikes(classId: Text) : async Result.Result<(Nat, Nat), Text> {
    switch (likesDislikes.get(classId)) {
      case (?counts) { #ok(counts) };
      case (null) { #err("Class not found") };
    }
  };

  system func preupgrade() {
    // This function is called before upgrading the canister
  };

  system func postupgrade() {
    // This function is called after upgrading the canister
    if (classesArray.size() == 0) {
      addInitialClass("warrior", "Warrior", "A strong melee fighter", "Tank", "warrior.jpg");
      addInitialClass("mage", "Mage", "A powerful spellcaster", "DPS", "mage.jpg");
      addInitialClass("healer", "Healer", "A supportive magic user", "Healer", "healer.jpg");
    }
  };
}
