
      var Data={ 
       getData:function getData(reqData,authFlg){
        var post_Data={};
        var error = {};
        var error_msg = "";

        if (reqData.method == "POST") {

            var post = reqData.body;

            if(!post.coid){ 
                error_msg += " coid cannot be null";
            } 
            if(!post.reqid){ 
                error_msg += " reqid cannot be null";
            } 
            if(!post.userid && authFlg == 1){ 
                error_msg += " userid cannot be null";
            }  

            post_Data.data = post;
            if(error_msg != ""){
                var resp = {
                    'status': "1",
                    'status_msg': error_msg
                };

                post_Data.status = resp;
            }
            else{
              var resp = {
                'status': "0",
                'status_msg': "Basic Auth done...!!"
            };

            post_Data.status = resp;
        }

    }else{
        var resp = {
            'status': "1",
            'status_msg': "Post Request required"
        };
        post_Data.status = resp;
    }
    return post_Data;
}
}
module.exports = Data;