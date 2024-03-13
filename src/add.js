import React, { useState } from 'react';
import { TextInput, Button } from 'react-native';
import { ref, set } from 'firebase/database';
import database from './firebase';

function AddData() {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = () => {
        const dataRef = ref(database, 'data/' + Date.now());
        set(dataRef, {
            value: inputValue
        }).then(() => {
            setInputValue('');
        }).catch((error) => {
            console.error("Data could not be saved." + error);
        });
    };

    return (
        <>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={text => setInputValue(text)}
                value={inputValue}
            />
            <Button onPress={handleSubmit} title="Submit" />
        </>
    );
}

export default AddData;