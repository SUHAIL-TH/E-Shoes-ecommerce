

function addtocart(proId){
    $.ajax({
        url:"/addtocart/"+proId,
        method:"get",
        success:(response)=>{
            if(response.status){
                let count=$('#cartcount').html()
                count=parseInt(count)+1
                $("#cartcount").html(count)
            }

        }
    })
}