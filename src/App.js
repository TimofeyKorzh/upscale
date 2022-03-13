import { TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
//import Button from './components/Button';
import Button from '@material-ui/core/Button'
import {MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './styles.scss';
import { postGenerateTextEndpoint } from './utils';
//import {Helmet} from "react-helmet";
//import { YMInitializer } from 'react-yandex-metrika';
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'
import { Container } from '@material-ui/core';
import { Box } from '@material-ui/core';

import ReactDOM from 'react-dom'
import FileUpload from "react-mui-fileuploader"
import Image from 'material-ui-image'
import Avatar from '@material-ui/core/Avatar';
import Paper from '@mui/material/Paper';

import { YMInitializer } from 'react-yandex-metrika';

const TITLE = 'Upscaler';

const handleFileUploadError = (error) => {
  // Do something...
}

const scrollToBottom = () => {
  const scrollHeight = this.messageList.scrollHeight;
  const height = this.messageList.clientHeight;
  const maxScrollTop = scrollHeight - height;
  this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
}

function App() {
  const [toggle, setToggle] = useState(false);
  const [image, setImage] = useState(" ");
  const [pending, setPending] = useState(false);
  //const [model, setModel] = useState('gpt2');
  
  const [temperature, setTemperature] = useState(1);
  const [lenght, setLenght] = useState(20);
  const [generatedText, postGenerateText] = postGenerateTextEndpoint();

  function b64toBlob(dataURI) {
    
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
}

  const handleFilesChange = (files) => {
    // Do something...
    if (files.length > 0){
      setPending(true);
      //console.log(atob(files[0].path.split(',')[1]))
      var myHeaders = new Headers();
      myHeaders.append("accept", "application/json");

      var formdata = new FormData();

      formdata.append("photo_file", b64toBlob(files[0].path), files[0].name);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      fetch("https://api.upx.monetka.name/image_post/", requestOptions)
        .then(
          function(result){ 
            //console.log(result);
            result.blob().then(function(blob) {
              //console.log(blob);
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => {
                const base64data = reader.result;
                //console.log(base64data);
                setImage(base64data);
                this.scrollToBottom();
                setPending(false);
            }
          });
          //FileUpload.handleRemoveFile(0);
          
        }
        
        )
        .catch(error => console.log('error', error));
          }
    
  }

 
  
  useEffect(() => {
    document.title = TITLE;
 }, []);

  
  const THEME = createMuiTheme({
    typography: {
     "fontFamily": `sans-serif`,
     "fontSize": 14,
     "fontWeightLight": 300,
     "fontWeightRegular": 400,
     "fontWeightMedium": 500
    },
 });

 const styles = {
  root: {
    marginLeft: 5
  }
}
const SpinnerAdornment = withStyles(styles)(props => (
  <CircularProgress
    className={props.classes.spinner}
    size={20}
    style={{marginLeft: "0.5em"}}
  />
))
const AdornedButton = (props) => {
  const {
    children,
    loading,
    ...rest
  } = props
  return (
    <Button size="large" style={{ marginTop: '1em', marginBottom: '1em', width: 'fit-content', paddingBottom: '2em', backgroundColor: 'transparent'}}

    color="primary"
    {...rest}>
       
      {children}
      {loading && <SpinnerAdornment  {...rest} />}
      
    </Button>
  )
}//shit
 
  const generateText = () => {
    generatedText.complete = false;
    postGenerateText({ image});
    setToggle(false);
  }
  if (generatedText.complete && !generatedText.error && !toggle){
    //setText(text+generatedText.data.result);
    setToggle(true);
  }
  return (
    
    <MuiThemeProvider theme ={THEME}>
    
    <div className='app-container'>
    <YMInitializer accounts={[87851063]} options={{webvisor: true}}/>
    
    <form noValidate autoComplete='off'> 
      
       
       
       <h1><span>Upscaler v0.7</span></h1>
       
       
       <div class = "myelement">
      
       {image == " " && 
       <FileUpload
      multiFile={true}
      disabled={false}
      title=" "
      header="[Закиньте файл!]"
      leftLabel="или"
      rightLabel=" , чтобы выбрать файлы вручную"
      buttonLabel=" нажмите "
      maxFileSize={50}
      maxUploadFiles={2}
      maxFilesContainerHeight={1}
      errorSizeMessage={'Ошибка! Слишком большой файл!'}
      allowedExtensions={['jpg', 'jpeg', 'png']}
      onFilesChange={handleFilesChange}
      onError={handleFileUploadError}
      
    />}
      
      
      {image == " " &&  <Box textAlign='center'>
        <AdornedButton onClick={generateText} loading = {pending}>
          
        </AdornedButton>
        </Box>
      }
      {image != " " &&
        <Button variant='outlined'
          onClick={() => {
            setImage(" ");
            setPending(false);
          }}
        >
          Новую?
        </Button>}
        {image != " " && 
        
        <Box textAlign='center'>
          <Paper variant="outlined">
          <img src={image} />
          </Paper>
        </Box>}
        </div>
        
        </form>

        <div class='image'>
    
        
        
    
    
    
    </div>
    </div>
    
    </MuiThemeProvider>
    
  );
}

export default App;
//{generatedText.pending&&
  //<div className='result pending'>Подождите!</div>}
  //
