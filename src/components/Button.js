import React from "react";
import styled from "styled-components/native";
import PropTypes from 'prop-types';

const TRANSPARENT = 'transparent';

const Container = styled.TouchableOpacity`
    background-color: ${({ theme, isFilled }) => isFilled ? theme.buttonBackground : TRANSPARENT};
    align-items: center;
    border-radius: 8px;
    width: 100%;
    padding: 10px;
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;
const Title = styled.Text`
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    color: ${({ theme, isFilled }) => isFilled ? theme.buttonTitle : theme.buttonUnfilledTitle};
`;

const Button = ({ containerStyle, title, onPress, isFilled=true, disabled }) => {
    return (
        <Container 
            style={containerStyle} 
            onPress={onPress} 
            isFilled={isFilled}
            disabled={disabled}
        >
            <Title isFilled={isFilled}>{title}</Title>
        </Container>
    );
};

// defaultProps 는 더이상 사용하지 않음. 함수 정의 시 직접 지정할 것
// Button.defaultProps = {
//    isFilled: true,
// };

Button.propTypes = {
    containerStyle: PropTypes.object,
    title: PropTypes.string,
    onPress: PropTypes.func.isRequired,
    isFilled: PropTypes.bool,
    disabled: PropTypes.bool,
};

export default Button;