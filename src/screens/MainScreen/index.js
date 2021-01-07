import React, { useState, useRef, useCallback } from 'react';
import Axios from 'axios';
import CForm from './components/form';
import Card from './components/card';

const initialState = {
    cardNumber: '#### #### #### ####',
    cardHolder: 'FULL NAME',
    cardMonth: '',
    cardYear: '',
    cardCvv: '',
    isCardFlipped: false,
};

const MainScreen = () => {
    const [state, setState] = useState(initialState);
    const [currentFocusedElm, setCurrentFocusedElm] = useState(null);

    const updateStateValues = useCallback(
        (keyName, value) => {
            setState({
                ...state,
                [keyName]: value || initialState[keyName],
            });
        },
        [state]
    );

    // References for the Form Inputs used to focus corresponding inputs.
    let formFieldsRefObj = {
        cardNumber: useRef(),
        cardHolder: useRef(),
        cardDate: useRef(),
        cardCvv: useRef(),
    };

    let focusFormFieldByKey = useCallback((key) => {
        formFieldsRefObj[key].current.focus();
    });

    // This are the references for the Card DIV elements.
    let cardElementsRef = {
        cardNumber: useRef(),
        cardHolder: useRef(),
        cardDate: useRef(),
    };

    let onCardFormInputFocus = (_event, inputName) => {
        const refByName = cardElementsRef[inputName];
        setCurrentFocusedElm(refByName);
    };

    let onCardInputBlur = useCallback(() => {
        setCurrentFocusedElm(null);
    }, []);

    const submitFormHandler = (e) => {
        e.preventDefault();
        // alert(state.cardNumber);
        console.log("cardnumber", state.cardNumber.length);
        console.log("cardHolder", state.cardHolder.match("^[a-zA-Z\(\)]+$"));
        if (!state.cardNumber.length ||  !state.cardHolder.match("^[a-zA-Z\(\)]+$")) {
            return alert("Please check the details again!")
        }
        Axios.post('https://ry8o1.sse.codesandbox.io/', {
            cardNumber: state.cardNumber,
            cardHolder: state.cardHolder,
            cardMonth: state.cardMonth,
            cardYear: state.cardYear,
            cardCvv: state.cardCvv,
        })
            .then(function (response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                }
                else if (response.data.error === false) {
                    alert(response.data.message)
                }
                else {
                    alert("Something went wrong!")
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    return (
        <div className="wrapper">
            <CForm
                cardMonth={state.cardMonth}
                cardYear={state.cardYear}
                onUpdateState={updateStateValues}
                cardNumberRef={formFieldsRefObj.cardNumber}
                cardHolderRef={formFieldsRefObj.cardHolder}
                cardDateRef={formFieldsRefObj.cardDate}
                onCardInputFocus={onCardFormInputFocus}
                onCardInputBlur={onCardInputBlur}
                submitFormHandler={submitFormHandler}
            >
                <Card
                    cardNumber={state.cardNumber}
                    cardHolder={state.cardHolder}
                    cardMonth={state.cardMonth}
                    cardYear={state.cardYear}
                    cardCvv={state.cardCvv}
                    isCardFlipped={state.isCardFlipped}
                    currentFocusedElm={currentFocusedElm}
                    onCardElementClick={focusFormFieldByKey}
                    cardNumberRef={cardElementsRef.cardNumber}
                    cardHolderRef={cardElementsRef.cardHolder}
                    cardDateRef={cardElementsRef.cardDate}
                ></Card>
            </CForm>
        </div>
    );
};

export default MainScreen;
