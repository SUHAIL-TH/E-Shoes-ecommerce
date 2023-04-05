

function addtocart(proId){
    $.ajax({
        url:"/addtocart/"+proId,
        method:"get",
        success:(response)=>{
            if(response.status){
              
                  Swal.fire({
                    
                    icon: 'success',
                    title: 'product added to cart',
                    showConfirmButton: false,
                    timer: 1000
                  })
                let count=$('#cartcount').html()
                count=parseInt(count)+1
                $("#cartcount").html(count)
                
            }else{
                
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Plz SignIn!',
                    showConfirmButton: false,
                    timer: 1000
                  })

            }

        }
    })
}

function addtowishlist(id,name,price){
    $.ajax({
        url:"/addtowhishlist",
        method:"post",
        data:{
            id:id,
            name:name,
            price:price
        },
        success:(response)=>{
            if(response.statud){
                Swal.fire({
                    icon: 'success',
                    title: 'product added to wishlist',
                    showConfirmButton: false,
                    timer: 1000
                    
                   
                  })
                 
            }else if(response.already){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Product already added to wishlist',
                    showConfirmButton: false,
                    timer: 1000
                   
                  })

            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Plz SignIn!',
                    showConfirmButton: false,
                    timer: 1000
                   
                  })

            }
        }

    })
}