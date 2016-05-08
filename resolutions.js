Resolutions = new Mongo.Collection('resolutions'); /* New Collection 'resolutions' 
 stored in variable called Resolutions */

myTestVariable = "stuff";

if (Meteor.isClient) { //if

    Meteor.subscribe('resolutions');

    Template.body.helpers({
        resolutions: function() {
            if (Session.get('hideFinished')) {
                return Resolutions.find({checked: false}); // [{stuff:keys}, ...]
            }
            return Resolutions.find(); // [{stuff:keys}, ...]

        },
        hideFinished: function() {
            return Session.get('hideFinished');
        }
    });

    Template.resolution.helpers({
        templateToLoad: function () {
            if(Session.get('user.currentCourse') == "TEAS") {
                return "teasTemplates";
            }
        },
        isOwner: function() {
            /*
             result should be true or false

             get user ID
             get resolution owner property (we just made it)
             check if the user ID matches the owner property
             */

            var currentUserID = Meteor.userId();
            var resolutionOwner = this.owner;
//            if (currentUserID === resolutionOwner) {
//                return true;
//            }
//            else {
//                return false;
//            }
            return (currentUserID === resolutionOwner);
        }
    });

    Template.body.events({
        'submit .new-resolution': function (event) {
            // ...
            var title = event.target.title.value;

            Meteor.call("addResolution" , title);

//            var jerk =  {title: title, createdAt: new Date()}; Old Insecure Code
//
//            Resolutions.insert(jerk); Insert Old Insecure code
////            console.log(Resolutions.find());
//            var resos = Resolutions.find();
////            console.log(resos.collection.queries["1"].results);
//            resos = resos.collection.queries["1"].results;
//            var item = resos.pop();
//            console.log(item);


//            var itemID = item._id;
//            Resolutions.remove(item._id);


            // console.log(Resolutions.find())
            // >>> [..., {title: title, createdAt: new Date()}]

            event.target.title.value = "";
            return false;
        },
        'change .hide-finished': function(event) {
            Session.set('hideFinished', event.target.checked );
        }
    });

    Template.resolution.events ({
        'click .toggle-checked': function () {
            Meteor.call("updateResolution" ,this._id ,!(this.checked));
        },
        'click .delete': function() {
            Meteor.call("deleteResolution" ,this._id);
        },
        'click .toggle-private': function() {
            Meteor.call("setPrivate" ,this._id, !this.private);
        }
    });

    Accounts.ui.config ({
        passwordSignupFields: "USERNAME_ONLY"
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });

    Meteor.publish('resolutions' , function(){
        return Resolutions.find({
            $or: [
                { private: {$ne: true} },
                { owner: this.userId }
            ]
        });
    });
}


var param = {
    addResolution: function(title) {
        var newResolution =  {title: title, createdAt: new Date(), owner: Meteor.userId()};
        Resolutions.insert(newResolution);
    },

    updateResolution: function(id, checked){
        Resolutions.update(id, {$set: {checked: checked}});
    },

    deleteResolution: function(id){
        var res = Resolutions.findOne(id);
        if(res.owner !== Meteor.userId()){
            throw new Meteor.Error('not-authorized');
        }
        Resolutions.remove(id);
    },

    setPrivate: function(id, private) {
        var res = Resolutions.findOne(id);

        if(res.owner !== Meteor.userId()){
            throw new Meteor.Error('not-authorized');
        }

        Resolutions.update(id, {$set: {private: private}});
    }


};

Meteor.methods(param);


//Router.route('/boards');