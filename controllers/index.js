const express = require('express');
const router = express.Router();
const randomstring = require("randomstring")
const nodemailer = require('nodemailer')
var cors = require('cors')


const GuestGroupList = require('../models/Guest')


/* GET home page. */
router.get('/rsvp', function(req, res, next) {
  
  GuestGroupList.find((err, groups)=>{
    if (err) res.render('index', { title: 'ERROR' }); 

    let totalGuests


    res.render('index', { title: 'Añadir a la lista', groups})
  })
});

router.delete('/rsvp', (req,res,next)=>{
  let id = req.body.id
  GuestGroupList.findOneAndRemove({_id: id}, (err, group)=>{
    if (err) return console.error(err)
  })
  res.sendStatus(200)
  
})


router.post('/add', (req,res,next)=>{
  console.log('req', req.body)
  let obj = {...req.body}
  obj.code = randomstring.generate(7)
  
  // console.log('obj', obj)
  var newGroup = new GuestGroupList(obj)

  newGroup.save((err, group)=>{
    if (err) return console.error(err)
  })

  res.sendStatus(200)
})


// confirmation API
router.get('/confirm/:id', (req, res, next)=>{
  // console.log('req.params.id', req.params.id)
  const code = req.params.id

  GuestGroupList.findOne({code}, (err, group)=>{
    // console.log('group', group)
    res.json(group);    
  })
})

router.post('/save-rsvp', (req,res,next)=>{
  const id = req.body.id
  const list = req.body.confirmedList


  GuestGroupList.findOneAndUpdate({_id: id}, {list}, (err, doc)=>{
    err ? console.log('error', err) : console.log('doc', doc)
    res.json(doc)
  })
  // res.sendStatus(200)
})

router.get('/edit/:id', (req,res,next)=>{
  const id = req.params.id
  const list = req.body.confirmedList


  GuestGroupList.findOne({_id: id}, (err, group)=>{
    err ? console.log('error', err) : console.log('group', group)
    res.render('edit', { title: 'Edicion', group})
    
  })
})

router.put('/edit/:id', (req,res,next)=>{
  const id = req.params.id
  const group = req.body

  console.log('group', group)
  console.log('id', id)

  GuestGroupList.findOneAndUpdate({_id: id}, {...group} ,(err, group)=>{
    err ? console.log('error', err) : console.log('group', group)
    res.render('edit', { title: 'Edicion', group})    
  })
})

router.post('/send', (req, res, next)=>{
  
  let id = req.body.id

  // finding on the DB THEN sending the email
  GuestGroupList.findById(id, (err, group)=>{
    if (err) return console.error(err)
  }).then(group => {
    // sending the email
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_AUTH_USER,
        pass: process.env.GMAIL_PASSWORD
      }
    })

    let listNames = group.list
    let liNames = ''
    listNames.forEach(function(guest) {
      liNames += `<li>${guest.guesName}</li>`
    });


    let html = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en" style="background-image:url(http://www.bodacarlosyalba.com/wp-content/themes/wedding-theme/images/pattern-boda.jpg)!important">
    
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width">
      <link href="https://fonts.googleapis.com/css?family=Amatic+SC:700" rel="stylesheet">
      <title>Invitacion Boda Carlos y Alba</title>
      <style>
        @media only screen {
          html {
            min-height: 100%;
            background: #f3f3f3
          }
        }
    
        @media only screen and (max-width:596px) {
          .small-float-center {
            margin: 0 auto!important;
            float: none!important;
            text-align: center!important
          }
        }
    
        @media only screen and (max-width:596px) {
          table.body img {
            width: auto;
            height: auto
          }
          table.body center {
            min-width: 0!important
          }
          table.body .container {
            width: 95%!important
          }
          table.body .columns {
            height: auto!important;
            -moz-box-sizing: border-box;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            padding-left: 16px!important;
            padding-right: 16px!important
          }
          table.body .columns .columns {
            padding-left: 0!important;
            padding-right: 0!important
          }
          table.body .collapse .columns {
            padding-left: 0!important;
            padding-right: 0!important
          }
          th.small-6 {
            display: inline-block!important;
            width: 50%!important
          }
          th.small-9 {
            display: inline-block!important;
            width: 75%!important
          }
          th.small-12 {
            display: inline-block!important;
            width: 100%!important
          }
          .columns th.small-12 {
            display: block!important;
            width: 100%!important
          }
          table.menu {
            width: 100%!important
          }
          table.menu td,
          table.menu th {
            width: auto!important;
            display: inline-block!important
          }
          table.menu.vertical td,
          table.menu.vertical th {
            display: block!important
          }
          table.menu[align=center] {
            width: auto!important
          }
        }
      </style>
    </head>
    
    <body style="-moz-box-sizing:border-box;-ms-text-size-adjust:100%;-webkit-box-sizing:border-box;-webkit-text-size-adjust:100%;Margin:0;box-sizing:border-box;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;min-width:100%;padding:0;text-align:left;width:100%!important">
      <span class="preheader" style="color:#f3f3f3;display:none!important;font-size:1px;line-height:1px;max-height:0;max-width:0;mso-hide:all!important;opacity:0;overflow:hidden;visibility:hidden"></span>
      <table class="body" style="Margin:0;background:0 0;border-collapse:collapse;border-spacing:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;height:100%;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;width:100%">
        <tr style="padding:0;text-align:left;vertical-align:top">
          <td class="center" align="center" valign="top" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">
            <center data-parsed="" style="min-width:580px;width:100%">
              <table align="center" class="container bg float-center" style="Margin:0 auto;background:#fefefe;background-color:#fff;border:2px solid silver;border-bottom:7px solid #F6CB7E;border-collapse:collapse;border-spacing:0;box-shadow:0 0 20px rgba(0,0,0,.3);float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:580px">
                <tbody>
                  <tr style="padding:0;text-align:left;vertical-align:top">
                    <td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">
                      <img src="http://bodacarlosyalba.com/wp-content/themes/wedding-theme/images/header_email.png" style="-ms-interpolation-mode:bicubic;clear:both;display:block;max-width:100%;outline:0;text-decoration:none;width:auto">
                      <div id="sub-header" style="text-align:center">
                        <table class="spacer" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                          <tbody>
                            <tr style="padding:0;text-align:left;vertical-align:top">
                              <td height="15px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:400;hyphens:auto;line-height:15px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&#xA0;</td>
                            </tr>
                          </tbody>
                        </table>
                        <table class="row" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%">
                          <tbody>
                            <tr style="padding:0;text-align:left;vertical-align:top">
                              <th class="small-12 large-5 columns first" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:16px;padding-right:8px;text-align:left;width:225.67px">
                                <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                  <tr style="padding:0;text-align:left;vertical-align:top">
                                    <th style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">
                                      <p class="text-left" style="Margin:0;Margin-bottom:10px;color:#4F4F4F;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:400;line-height:1.1em;margin:0!important;margin-bottom:10px;padding:0;text-align:left">Raúl Bahamón Ardila
                                        <br>Lucero Rodríguez Crespo</p>
                                    </th>
                                  </tr>
                                </table>
                              </th>
                              <th class="small-12 large-2 columns" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:8px;padding-right:8px;text-align:left;width:80.67px">
                                <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                  <tr style="padding:0;text-align:left;vertical-align:top">
                                    <th style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left"></th>
                                  </tr>
                                </table>
                              </th>
                              <th class="small-12 large-5 columns last" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:8px;padding-right:16px;text-align:left;width:225.67px">
                                <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                  <tr style="padding:0;text-align:left;vertical-align:top">
                                    <th style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">
                                      <p class="text-right" style="Margin:0;Margin-bottom:10px;color:#4F4F4F;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:400;line-height:1.1em;margin:0!important;margin-bottom:10px;padding:0;text-align:right">
                                        <span class="sutil" style="color:silver;font-size:12px">✝</span> Ingrid Alcaino Travieso
                                        <br>
                                        <span class="sutil" style="color:silver;font-size:12px">✝</span> Washington Junod Pacheco
                                        <br>Ingrid Junod Alcaino</p>
                                    </th>
                                  </tr>
                                </table>
                              </th>
                            </tr>
                          </tbody>
                        </table>
                        <table class="row" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%">
                          <tbody>
                            <tr style="padding:0;text-align:left;vertical-align:top">
                              <th class="small-12 large-12 columns first last" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:16px;padding-right:16px;text-align:left;width:564px">
                                <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                  <tr style="padding:0;text-align:left;vertical-align:top">
                                    <th style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">
                                      <p class="text-center" style="Margin:0;Margin-bottom:10px;color:#4F4F4F;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:400;line-height:1.1em;margin:0!important;margin-bottom:10px;padding:0;text-align:center">Tienen el placer de invitar al matrimonio de sus amados a</p>
                                    </th>
                                    <th class="expander" style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;visibility:hidden;width:0"></th>
                                  </tr>
                                </table>
                              </th>
                            </tr>
                          </tbody>
                        </table>
                        <table class="spacer" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                          <tbody>
                            <tr style="padding:0;text-align:left;vertical-align:top">
                              <td height="5px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:5px;font-weight:400;hyphens:auto;line-height:5px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&#xA0;</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <table class="spacer" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                        <tbody>
                          <tr style="padding:0;text-align:left;vertical-align:top">
                            <td height="15px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:400;hyphens:auto;line-height:15px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&#xA0;</td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%">
                        <tbody>
                          <tr style="padding:0;text-align:left;vertical-align:top">
                            <th class="small-12 large-4 columns first" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:16px;padding-right:8px;text-align:left;width:177.33px">
                              <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                <tr style="padding:0;text-align:left;vertical-align:top">
                                  <th style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left"></th>
                                </tr>
                              </table>
                            </th>
                            <th class="bg-header small-9 large-9 columns" style="Margin:0 auto;border:1px solid silver;box-shadow:0 5px 50px rgba(0,0,0,.1);color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:8px;padding-right:8px;padding-top:20px;text-align:center;width:419px">
                              <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                <tr style="padding:0;text-align:left;vertical-align:top">
                                  <th style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">
                                    <center data-parsed="" style="min-width:387px;width:100%">
                                      <h2 align="center" class="float-center" style="Margin:0;Margin-bottom:10px;color:inherit;font-family:'Amatic SC',cursive;font-size:30px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:center;word-wrap:normal">${group.groupName}</h2>
                                    </center>
                                  </th>
                                </tr>
                              </table>
                            </th>
                            <th class="small-12 large-4 columns last" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:8px;padding-right:16px;text-align:left;width:177.33px">
                              <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                <tr style="padding:0;text-align:left;vertical-align:top">
                                  <th style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left"></th>
                                </tr>
                              </table>
                            </th>
                          </tr>
                        </tbody>
                      </table>
                      <table class="spacer" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                        <tbody>
                          <tr style="padding:0;text-align:left;vertical-align:top">
                            <td height="40px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:40px;font-weight:400;hyphens:auto;line-height:40px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&#xA0;</td>
                          </tr>
                        </tbody>
                      </table>
                      <column>
                        <table class="row" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%">
                          <tbody>
                            <tr style="padding:0;text-align:left;vertical-align:top">
                              <th class="small-12 large-6 columns first" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:16px;padding-right:8px;text-align:left;width:274px">
                                <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                  <tr style="padding:0;text-align:left;vertical-align:top">
                                    <th style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">
                                      <p style="Margin:0;Margin-bottom:10px;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left">El matrimonio que se realizará en la
                                        <br>ciudad de Cali,Colombia el día 19 de marzo del 2018. Para tener mas
                                        <br>información y confirmar tu asistencia rogamos visitar la página de la boda.</p>
                                      <table
                                        class="spacer" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                        <tbody>
                                          <tr style="padding:0;text-align:left;vertical-align:top">
                                            <td height="16px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:16px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&#xA0;</td>
                                          </tr>
                                        </tbody>
                                </table>
                                <p style="Margin:0;Margin-bottom:10px;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left">
                                  <em>Esta invitación es válida para:</em>
                                </p>
                                <ul>${liNames}</ul>
                                <table class="spacer" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                  <tbody>
                                    <tr style="padding:0;text-align:left;vertical-align:top">
                                      <td height="16px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:16px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&#xA0;</td>
                                    </tr>
                                  </tbody>
                                </table>
                                <p style="Margin:0;Margin-bottom:10px;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left">
                                  <em>Para confirmar tu asistencia ingresa a
                                    <a href="http://www.bodacarlosyalba.com" style="Margin:0;color:#2199e8;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none">www.bodacarlosyalba.com</a> y coloca el siguiente código:</em>
                                </p>
                                <table class="spacer" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                  <tbody>
                                    <tr style="padding:0;text-align:left;vertical-align:top">
                                      <td height="12px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;hyphens:auto;line-height:12px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&#xA0;</td>
                                    </tr>
                                  </tbody>
                                </table>
                                <p style="Margin:0;Margin-bottom:10px;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left">
                                  <span class="code" style="background-color:#F6CB7E;border-radius:5px;padding:10px">${group.code}</span>
                                </p>
                                </th>
                                </tr>
                        </table>
                        </th>
                        <th class="small-12 large-6 columns last" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:8px;padding-right:16px;text-align:left;width:274px">
                          <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                            <tr style="padding:0;text-align:left;vertical-align:top">
                              <th style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">
                                <img src="http://bodacarlosyalba.com/wp-content/themes/wedding-theme/images/albita-y-carlos.gif"
                                  style="-ms-interpolation-mode:bicubic;clear:both;display:block;max-width:100%;outline:0;text-decoration:none;width:auto">
                              </th>
                            </tr>
                          </table>
                        </th>
                        </tr>
                        </tbody>
              </table>
              <table class="spacer" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                <tbody>
                  <tr style="padding:0;text-align:left;vertical-align:top">
                    <td height="16px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:16px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&#xA0;</td>
                  </tr>
                </tbody>
              </table>
              <table class="row" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%">
                <tbody>
                  <tr style="padding:0;text-align:left;vertical-align:top">
                    <th class="small-12 large-12 columns first" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:16px;padding-right:8px;text-align:left;width:564px">
                      <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                        <tr style="padding:0;text-align:left;vertical-align:top">
                          <th style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">
                            <p class="fecha" style="Margin:0;Margin-bottom:10px;background-color:#FF5370;color:#fff;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:10px;text-align:left;text-decoration:underline">Por favor confirmar
                              <strong>antes del 4 de febrero</strong>
                            </p>
                          </th>
                          <th class="expander" style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;visibility:hidden;width:0"></th>
                        </tr>
                      </table>
                    </th>
                    <th class="small-12 large-12 columns last" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:8px;padding-right:16px;text-align:left;width:564px">
                      <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                        <tr style="padding:0;text-align:left;vertical-align:top">
                          <th style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">
                            <p style="Margin:0;Margin-bottom:10px;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left">
                              <small style="color:#cacaca;font-size:80%">Si tienes algún problema para hacer tu reservación porfavor escríbenos
                                <a href="mailto:junodbahamon@gmail.com"
                                  style="Margin:0;color:#2199e8;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none">aquí</a> y con gusto te ayudaremos</small>
                            </p>
                          </th>
                          <th class="expander" style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;visibility:hidden;width:0"></th>
                        </tr>
                      </table>
                    </th>
                  </tr>
                </tbody>
              </table>
              </column>
              </td>
              </tr>
              </tbody>
      </table>
      </center>
      </td>
      </tr>
      </table>
      <!-- prevent Gmail on iOS font size manipulation -->
      <div style="display:none;white-space:nowrap;font:15px courier;line-height:0">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div>
    </body>
    
    </html>`

    var mailOption = {
      from: process.env.GMAIL_AUTH_USER,
      to: group.email,
      subject: 'Invitacion Boda Carlos y Alba',
      text: `
      Raúl Bahamón Ardila
      Lucero Rodríguez Crespo
      
      y

      ✞ Ingrid Alcaino Travieso      
      Ingrid Junod Alcaino
      `,
      html
    }

    console.log('✉️ ENVIADO!!!!')
    transporter.sendMail(mailOption, (err, result) => {        
      if (err) {
        res.sendStatus(500)  
        return console.log('err', err)    

      } else {
        console.log('email was sent')

        group.tracking.count++   

        let tracking = {
          sent: true,
          count: group.tracking.count
        }    

        GuestGroupList.update({_id: id}, { tracking }, (err, doc)=>{
          err ? console.log('error', err) : console.log('doc', doc)        
        })
        res.sendStatus(200)      
      }
    })


  })
  
})

module.exports = router;
