

function addtocart(proId){
    $.ajax({
        url:"/addtocart/"+proId,
        method:"get",
        success:(response)=>{
            if(response.status){
                Swal.fire({
                    icon: 'success',
                    title: 'product added to cart',
                    
                   
                  })
                let count=$('#cartcount').html()
                count=parseInt(count)+1
                $("#cartcount").html(count)
                
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Plz SignIn!',
                   
                  })

            }

        }
    })
}