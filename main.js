(function(window, $, undefined){

$(function(){


  // TaskのModelを作成する。
  var Task = Backbone.Model.extend({

    // default attrs for TaskList
    default: function(){},

    initialize: function(attrs, options){
      this.taskName = attrs["taskName"];
      this.bind("change:id", function(model, val) {
        console.log("change:id is called. prevId=" + model.previous("id") + ", newId=" + val);
      });
      this.bind("change", function(model ,val) {
        console.log("change is called. model:val", model, val);
      });
    },

    // create ID.
    createId: function() {
      var key = "aosdfijsaosdIdIndex";
      var id = window.localStorage.getItem(key);
      if (!id) {
        window.localStorage.setItem(key, 0);
        return 0;
      } else {
        id = parseInt(id);
        window.localStorage.setItem(key, ++id);
        return id;
      }
    },

    // Validation
    validate: function(attrs) {
      if (!attrs.id || attrs.id.length === 0) {
        return "id must not be blank";
      }
    },



    // some Action
    doAction: function(){/*dummy*/}

  });

  // Taskの集合を定義する。
  var TaskList = Backbone.Collection.extend({

    // Reference to this collection's model;
    model: Task
  });

  var taskList = new TaskList();



  // TaskListで利用するViewを作成する。
  console.log("Backbone", Backbone);
  console.log("Backbone.View", Backbone.View);
  var TaskListView = Backbone.View.extend({

    // ここでも指定できるけど、今回は引数で指定する。
    // el : $(".tasklist"),

    // override tag name
    tagName: "li",

    // temporary. in future, replace to Model Class.
    tasks : [],
    taskModelList: [],

    // 監視するイベントを登録する。
    events: {
      "click #regist-btn" : "regist",
      "click .clear" : "removeItem"
    },

    // 初期化処理時に、Modelへのオブザーブを設定する。
    initialize: function() {
    },

    // 描画処理を定義する。
    render: function() {
      console.log("render");
      this.$el.find(".tasklist").html("");
      this.collection.each(function(task) {
        $(".tasklist").append(_.template($("#tasklist-template").html(), {taskname: task.taskName, pos:task.get("id")}));
      });

      return this;
    },

    // 登録処理
    regist: function() {
      console.log("regist");
      var taskContent = $("#inputbox").val();

      // save to Collection.
      var task = new Task({taskName: taskContent});
      task.set({id: task.createId()});
      task.bind("error", this.showAlert);
      var result = task.set({id: ""});
      alert("result: " + result);
      this.collection.add(task);

      this.render();

      return false;
    },

    // 削除処理
    removeItem: function(e) {
      console.log("removeItem");
      var pos = $(e.currentTarget).parent().data("pos");

      this.collection.remove(this.collection.get(pos));

      this.render();

      return false;
    },

    // バリデーションエラー時の処理
    showAlert : function(model, err) {
      console.log(err);
      alert(err);
    }
  });


  var view = new TaskListView({collection: taskList, el: $("body")});



  // Routerの設定
  // var MyRouter = Backbone.Router.extend({
  //   routes: {
  //     "foo/:hoge" : "bar"
  //   },

  //   bar: function(hoge) {
  //     alert(hoge);
  //   }
  // });

  // new MyRouter();
  // Backbone.history.start({pushState: true, root: "/hoge/"});
  // $("a[href=#]").bind("click", function(e) {
  //   router.navigate(($this).attr("href").substr(1), true);
  //   e.preventDefault();
  // });

});



})(window, $);
















































