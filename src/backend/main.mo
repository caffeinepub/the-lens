import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Product Types
  type ProductId = Text;
  type OrderId = Text;
  // More categories will be added.
  type Category = { #homeDecor; #electronics };
  type OrderStatus = { #pending; #completed; #cancelled };

  public type Product = {
    id : ProductId;
    name : Text;
    description : Text;
    price : Nat;
    category : Category;
    stock : Nat;
    published : Bool;
  };

  module Product {
    public func compare(a : Product, b : Product) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  public type OrderItem = {
    productId : ProductId;
    quantity : Nat;
  };

  public type Order = {
    id : OrderId;
    userId : Principal;
    items : [OrderItem];
    total : Nat;
    status : OrderStatus;
    timestamp : Time.Time;
  };

  module ShopOrder {
    public func compare(a : Order, b : Order) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  // Extended User Profile Type
  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
    phoneVerified : Bool;
  };

  // Persistent State Maps
  let products = Map.empty<ProductId, Product>();
  let orders = Map.empty<OrderId, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextOrderId = 1;

  // Phone Verification Services Types

  type VerificationAttempt = {
    code : Text;
    expiresAt : Time.Time;
    phoneNumber : Text;
  };

  let verificationAttempts = Map.empty<Principal, VerificationAttempt>();
  let maxAttempts = 3;

  // User Profile APIs (with phone verification).
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    switch (userProfiles.get(caller)) {
      case (?existingProfile) {
        // If the phone has changed, it must be re-verified.
        if (existingProfile.phone != profile.phone) {
          let updatedProfile = { profile with phoneVerified = false };
          userProfiles.add(caller, updatedProfile);
        } else {
          userProfiles.add(caller, profile);
        };
      };
      case (null) { userProfiles.add(caller, profile) };
    };
  };

  public shared ({ caller }) func requestPhoneVerification(phone : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can request phone verification");
    };

    // Verify that the phone number matches the caller's profile
    switch (userProfiles.get(caller)) {
      case (?profile) {
        if (profile.phone != phone) {
          Runtime.trap("Unauthorized: Can only verify the phone number in your profile");
        };
      };
      case (null) {
        Runtime.trap("Profile not found: Please save your profile first");
      };
    };

    let code = "1234"; // For now, always use 1234 as code. TODO: Replace with actual random code.
    // Code is valid for 5 minutes.
    let expiresAt = Time.now() + 5 * 60 * 1000000000;

    let attempt : VerificationAttempt = {
      code;
      expiresAt;
      phoneNumber = phone;
    };

    verificationAttempts.add(caller, attempt);
  };

  public shared ({ caller }) func verifyPhoneVerificationCode(phone : Text, code : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can verify phone");
    };

    // Verify that the phone number matches the caller's profile
    switch (userProfiles.get(caller)) {
      case (?profile) {
        if (profile.phone != phone) {
          Runtime.trap("Unauthorized: Can only verify the phone number in your profile");
        };
      };
      case (null) {
        Runtime.trap("Profile not found");
      };
    };

    switch (verificationAttempts.get(caller)) {
      case (?attempt) {
        if (attempt.phoneNumber != phone) { return false };
        if (attempt.code != code) { return false };

        // Check expiry time
        if (Time.now() > attempt.expiresAt) { return false };

        switch (userProfiles.get(caller)) {
          case (?profile) {
            let updatedProfile = { profile with phoneVerified = true };
            userProfiles.add(caller, updatedProfile);
          };
          case (null) {};
        };
        verificationAttempts.remove(caller);
        true;
      };
      case (null) { false };
    };
  };

  public query ({ caller }) func isPhoneVerified(phone : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check phone verification status");
    };

    switch (userProfiles.get(caller)) {
      case (?profile) { return profile.phone == phone and profile.phoneVerified };
      case (null) { false };
    };
  };

  // Shop Character List API.
  public shared ({ caller }) func initializeShop() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can initialize the shop");
    };

    let initialProducts : [Product] = [
      {
        id = "prod1";
        name = "Wireless Headphones";
        description = "High-quality noise-cancelling headphones.";
        price = 150;
        category = #electronics;
        stock = 50;
        published = true;
      },
      {
        id = "prod2";
        name = "Vintage Lamp";
        description = "Elegant home decor lamp with a vintage design.";
        price = 80;
        category = #homeDecor;
        stock = 30;
        published = true;
      },
      {
        id = "prod3";
        name = "Smart Thermostat";
        description = "Programmable thermostat for energy efficiency.";
        price = 120;
        category = #electronics;
        stock = 25;
        published = true;
      },
      {
        id = "cmf-earbuds";
        name = "CMF CC Bluetooth Earbuds With High Bass Sound In Ear TWS Black";
        description = "\nSpecifications:\n- Brand: CMF\n- Product Code: AUDIOHEADPHONE-CMF-VALE-1782609C7A679FF\n- Warranty Type: Seller's Warranty\n- Warranty: 6 months\n- Sales Package: 1 Earbuds\n- SUPC: SDL652881676";
        price = 700;
        category = #electronics;
        stock = 100;
        published = true;
      },
    ];

    for (product in initialProducts.values()) {
      products.add(product.id, product);
    };
  };

  // Product APIs
  public query ({ caller }) func getProduct(productId : ProductId) : async Product {
    switch (products.get(productId)) {
      case (?product) {
        if (not product.published and not (AccessControl.isAdmin(accessControlState, caller))) {
          Runtime.trap("Unauthorized: Only admins can view unpublished products");
        };
        product;
      };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    let filtered = products.values().toArray().filter(
      func(product) {
        product.published;
      }
    );
    filtered.sort();
  };

  public query ({ caller }) func getProductsByCategory(category : Category) : async [Product] {
    let filtered = products.values().toArray().filter(
      func(product) {
        product.category == category and product.published;
      }
    );
    filtered.sort();
  };

  public query ({ caller }) func adminGetAllProducts() : async [Product] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all products");
    };
    products.values().toArray().sort();
  };

  public shared ({ caller }) func adminCreateProduct(product : Product) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    if (products.containsKey(product.id)) {
      Runtime.trap("Product already exists");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func adminUpdateProduct(product : Product) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    if (not products.containsKey(product.id)) {
      Runtime.trap("Product not found");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func adminSetProductPublishStatus(productId : ProductId, published : Bool) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update the product publish status");
    };
    switch (products.get(productId)) {
      case (?product) {
        let updatedProduct = { product with published };
        products.add(productId, updatedProduct);
      };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  // Order APIs
  public shared ({ caller }) func createOrder(items : [OrderItem]) : async OrderId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    var total : Nat = 0;
    for (item in items.values()) {
      switch (products.get(item.productId)) {
        case (?product) {
          if (item.quantity > product.stock) {
            Runtime.trap("Not enough stock for product " # item.productId);
          };
          if (not product.published) {
            Runtime.trap("Product " # item.productId # " is not available for purchase");
          };
          total += product.price * item.quantity;
        };
        case (null) { Runtime.trap("Product " # item.productId # " not found") };
      };
    };

    let orderId = nextOrderId.toText();
    nextOrderId += 1;

    let order : Order = {
      id = orderId;
      userId = caller;
      items;
      total;
      status = #pending;
      timestamp = Time.now();
    };

    orders.add(orderId, order);
    orderId;
  };

  public query ({ caller }) func getOrder(orderId : OrderId) : async Order {
    switch (orders.get(orderId)) {
      case (?order) {
        if (caller != order.userId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        order;
      };
      case (null) { Runtime.trap("Order not found") };
    };
  };

  public query ({ caller }) func getOrdersByUser(userId : Principal) : async [Order] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };

    let filtered = orders.values().toArray().filter(
      func(order) {
        order.userId == userId;
      }
    );
    filtered.sort();
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray().sort();
  };
};
