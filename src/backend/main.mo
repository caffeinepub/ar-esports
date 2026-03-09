import Text "mo:core/Text";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import List "mo:core/List";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    email : Text;
    age : Nat;
    createdAt : Int;
  };

  public type TournamentSlot = {
    id : Nat;
    name : Text;
    time : Text;
    entryFee : Nat;
    prizePool : Nat;
  };

  public type RegistrationStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type Registration = {
    id : Text;
    userId : Principal;
    slotId : Nat;
    ffUID : Text;
    gameName : Text;
    phone : Text;
    email : Text;
    teamMembers : Text;
    upiOrInsta : Text;
    status : RegistrationStatus;
    createdAt : Int;
  };

  module Registration {
    public func compareByCreatedAt(a : Registration, b : Registration) : Order.Order {
      Nat.compare(a.slotId, b.slotId);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let registrations = Map.empty<Text, Registration>();
  var registrationCounter = 0;

  let tournamentSlots : [TournamentSlot] = [
    {
      id = 1;
      name = "2 vs 2";
      time = "11:00 AM";
      entryFee = 30;
      prizePool = 50;
    },
    {
      id = 2;
      name = "4 vs 4";
      time = "01:00 PM";
      entryFee = 40;
      prizePool = 65;
    },
    {
      id = 3;
      name = "2 vs 2";
      time = "04:00 PM";
      entryFee = 30;
      prizePool = 50;
    },
    {
      id = 4;
      name = "4 vs 4";
      time = "08:00 PM";
      entryFee = 40;
      prizePool = 65;
    },
  ];

  // REQUIRED USER PROFILE FUNCTIONS

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { ?profile };
    };
  };

  // USERS

  public shared ({ caller }) func saveUserProfile(name : Text, email : Text, age : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let profile = {
      name;
      email;
      age;
      createdAt = Time.now();
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getAllUsers() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    userProfiles.values().toArray();
  };

  // TOURNAMENTS

  public query ({ caller }) func getTournamentSlots() : async [TournamentSlot] {
    // Public access - no authorization check needed
    tournamentSlots;
  };

  // REGISTRATIONS

  public shared ({ caller }) func registerForTournament(slotId : Nat, ffUID : Text, gameName : Text, phone : Text, email : Text, teamMembers : Text, upiOrInsta : Text) : async {
    #ok : Text;
    #err : Text;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register for tournaments");
    };

    if (hasExistingRegistration(caller, slotId)) { return #err("Already registered for this slot") };

    registrationCounter += 1;
    let registrationId = "REG-" # registrationCounter.toText();

    let registration = {
      id = registrationId;
      userId = caller;
      slotId;
      ffUID;
      gameName;
      phone;
      email;
      teamMembers;
      upiOrInsta;
      status = #pending;
      createdAt = Time.now();
    };

    registrations.add(registrationId, registration);
    #ok(registrationId);
  };

  public query ({ caller }) func getMyRegistrations() : async [Registration] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view registrations");
    };

    let callerRegistrations = List.empty<Registration>();
    for ((_, reg) in registrations.entries()) {
      if (reg.userId == caller) {
        callerRegistrations.add(reg);
      };
    };
    callerRegistrations.toArray().sort(Registration.compareByCreatedAt);
  };

  public shared ({ caller }) func submitPaymentClaim(registrationId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit payment claims");
    };

    let registration = getRegistrationOrTrap(registrationId);
    if (registration.userId != caller) { Runtime.trap("Unauthorized: Not your registration") };

    let updatedRegistration = {
      registration with
      status = #pending;
    };
    registrations.add(registrationId, updatedRegistration);
  };

  public query ({ caller }) func getAllRegistrations() : async [Registration] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all registrations");
    };
    registrations.values().toArray();
  };

  public shared ({ caller }) func approvePayment(registrationId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve payments");
    };

    let registration = getRegistrationOrTrap(registrationId);
    let updatedRegistration = {
      registration with
      status = #approved;
    };
    registrations.add(registrationId, updatedRegistration);
  };

  public shared ({ caller }) func rejectPayment(registrationId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reject payments");
    };

    let registration = getRegistrationOrTrap(registrationId);
    let updatedRegistration = {
      registration with
      status = #rejected;
    };
    registrations.add(registrationId, updatedRegistration);
  };

  // ADMIN

  public query ({ caller }) func adminLogin(password : Text) : async Bool {
    // This function validates the password and can be used by frontend
    // but actual admin role assignment should be done separately
    password == "adarshwebmaker";
  };

  // HELPERS

  func getRegistrationOrTrap(registrationId : Text) : Registration {
    switch (registrations.get(registrationId)) {
      case (null) { Runtime.trap("Registration not found") };
      case (?registration) { registration };
    };
  };

  func hasExistingRegistration(userId : Principal, slotId : Nat) : Bool {
    for ((_, reg) in registrations.entries()) {
      if (reg.userId == userId and reg.slotId == slotId) {
        return true;
      };
    };
    false;
  };
};
