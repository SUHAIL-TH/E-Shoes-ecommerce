

function addtocart(proId){
    $.ajax({
        url:"/addtocart/"+proId,
        method:"get",
        success:(response)=>{
            if(response.status){
                swal({
                    title: "Product added to cart",
                    text: "",
                    icon: "success",
                    button: "Ok",
                  });
                let count=$('#cartcount').html()
                count=parseInt(count)+1
                $("#cartcount").html(count)
                
            }

        }
    })
}