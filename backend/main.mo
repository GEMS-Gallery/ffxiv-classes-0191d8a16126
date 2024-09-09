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
      addInitialClass("paladin", "Paladin", "A holy knight who protects allies with a shield", "Tank", "paladin.jpg");
      addInitialClass("warrior", "Warrior", "A brutal combatant who wields a giant axe", "Tank", "warrior.jpg");
      addInitialClass("darkknight", "Dark Knight", "A knight who channels darkness to protect others", "Tank", "darkknight.jpg");
      addInitialClass("gunbreaker", "Gunbreaker", "A defender who uses a gunblade to protect allies", "Tank", "gunbreaker.jpg");
      addInitialClass("whitemage", "White Mage", "A healer who uses nature's power to mend wounds", "Healer", "whitemage.jpg");
      addInitialClass("scholar", "Scholar", "A tactician who uses a fairy companion to heal and protect", "Healer", "scholar.jpg");
      addInitialClass("astrologian", "Astrologian", "A healer who uses divination to support the party", "Healer", "astrologian.jpg");
      addInitialClass("sage", "Sage", "A barrier healer who uses nouliths to protect and heal", "Healer", "sage.jpg");
      addInitialClass("monk", "Monk", "A martial artist who channels chi for powerful attacks", "Melee DPS", "monk.jpg");
      addInitialClass("dragoon", "Dragoon", "A lancer who performs acrobatic jumps to attack", "Melee DPS", "dragoon.jpg");
      addInitialClass("ninja", "Ninja", "A swift assassin who uses ninjutsu to attack and trick enemies", "Melee DPS", "ninja.jpg");
      addInitialClass("samurai", "Samurai", "A swordmaster who uses katana techniques for powerful strikes", "Melee DPS", "samurai.jpg");
      addInitialClass("reaper", "Reaper", "A sinister melee fighter who channels void powers", "Melee DPS", "reaper.jpg");
      addInitialClass("bard", "Bard", "An archer who uses songs to support allies", "Physical Ranged DPS", "bard.jpg");
      addInitialClass("machinist", "Machinist", "An engineer who wields firearms and deploys turrets", "Physical Ranged DPS", "machinist.jpg");
      addInitialClass("dancer", "Dancer", "A performer who uses dances to enhance allies and damage foes", "Physical Ranged DPS", "dancer.jpg");
      addInitialClass("blackmage", "Black Mage", "A destructive caster who wields the elements", "Magical Ranged DPS", "blackmage.jpg");
      addInitialClass("summoner", "Summoner", "A spellcaster who summons powerful primals", "Magical Ranged DPS", "summoner.jpg");
      addInitialClass("redmage", "Red Mage", "A versatile mage who balances white and black magic", "Magical Ranged DPS", "redmage.jpg");
      addInitialClass("bluemage", "Blue Mage", "A caster who learns abilities from monsters", "Limited Job", "bluemage.jpg");
    }
  };
}
