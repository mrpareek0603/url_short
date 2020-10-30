const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
// const stripHtml = require('string-strip-html');
app.use(express.json());
app.use(cors());
const randomstring = require("randomstring");
const User = require('./Models/User');
const Url = require('./Models/Url');
const PORT = 5000;

// const generateSlug = async ()=>{
    
//     const alpha = "abcdefghijklmnopqrstABCDEFGHIJKLMNOPQRST0123456789"
//       let temp = slugId;
//       let result = "";
//       while(temp!=0){
        
//         const rem = temp%62;
//         result = result + alpha.charAt(rem);
//         temp = parseInt(temp/62);
//       }
//       slugId++;
//       while(result.length < 7){
//         result = result + Math.floor(Math.random(0,1)*62)
//       }
//       console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiii"+typeof result)
//       return stripHtml(result);
    
// }



mongoose.connect("mongodb+srv://admin123:admin123@cluster0.qwfwj.mongodb.net/url-shortener?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser:true },()=>{
    console.log("Database connected");
});

// signup functionality
app.post('/user/new',(req,res)=>{
    const {name,email,password} = {...req.body};// destructuring the body object

    User.find({email})
    // array of users with the given email
    .then(user=>{
        if(user.length !=0){
            res.json({"msg":"Email already in use",isSuccessfull:false});
        }
        else{
             const newUser = User({name,email,password});

             bcrypt.hash(password, saltRounds, function(err, hash) {
            // Store hash in your password DB.
            if(err){
                throw err;
            }
            else{
                newUser.password = hash;
                newUser.save()
                .then(user=>res.status(200).json({"msg":`New user with id:-${user._id} is made`,isSuccessfull:true}))
                .catch(err=>console.log(err));
                }
            });
        }
    }).catch(err=>{
        console.log('error while finding the email in db');
    })
});



// login functionality
app.post('/user/login', (req,res)=>{
    const {email,password} = {...req.body};

    User.find({email}).then(user=>{
            if(user.length == 0){
                res.json({"msg":"No email id exists",id:null});
            }
            else{
                // email exists, now check for password
                const dbPass = user[0].password;
                bcrypt.compare(password,dbPass,function(err,isMatch){
                    if(err){
                        throw err;
                    }

                    if(isMatch){
                        res.json({"msg":"login successfull",id:user[0]._id});
                    }
                    else{
                        res.json({"msg":"invalid credentials",id:null});
                    }
                });
            }
        });
});

// dashbord

app.post('/dashboard',(req,res)=>{
    let {longurl,shorturl,password} = {...req.body};
    if(shorturl.length === 0){
        shorturl = ""+ randomstring.generate({
            length: 7,
            charset: 'alphabetic'
          });

    }
    
    // console.log(slugId);
    Url.findOne({slug:shorturl})
    .then(u=>{
        
        if(u){
            console.log("i am inside if");
            return res.json({"msg":`Short url- "${shorturl}" already exist`,"miniurl":null,isSuccessfull:false});
        }
        else{
            console.log("i am inside else");
            let slug = shorturl;
            console.log(slug+shorturl);

            // if(password){
            //     bcrypt.hash(password, 10, function(err, hash) {
            //         // Store hash in your password DB.
            //         const newUrl = new Url(
            //             {slug:slug,
            //              destination:longurl,
            //              password:hash
            //              });
            //              console.log(slug,long);
            //                    newUrl.save().then((u)=>{res.json({"msg":`The url-" ${longurl}" is shortened as- "${slug}"`,isSuccessfull:true})})
            //                    .catch(err=>console.log(err));

            //             });
            //         }
    

            // else{
                const newUrl = new Url({
                    slug:slug,
                    destination:longurl,
                    password});
                     console.log(newUrl)
                           newUrl.save().then((u)=>{
                            res.json({"msg":`The url- "${longurl}" is shortened as- "${slug}"`,isSuccessfull:true});
                                 })
                                 .catch(err=>console.log(err));

            // }

        }}).catch(err=>console.log(err));
    });


app.get('/api/short',(req,res)=>{
    Url.find().then(url=>{
        res.json({payload:url})
    }).catch(err=>{
        console.log(err);
    })
})

// if user put the slug in the url
app.get('/:slug',(req,res)=>{
    const slug= req.params.slug;
    Url.find({slug}).then((slug)=>{
        if(slug.length!=0){
            // res.json({"msg":"redirection successfull","redirectTo":slug[0].destiation});
            console.log(slug[0].destination);
            res.redirect(`https://${slug[0].destination}`);
        }
        else{
            // res.json({"msg":"shorttened url not found","redirectingTo":"/dashboard"});
            res.redirect("http://localhost:3000/dashboard");
        }
    })
})
app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`);
});