import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { sendOtp, verifyOtp } from "@/backendServices/otpServices";
import { useRouter } from "expo-router";

export default function Auth() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleEmailSubmit = async () => {
    if (!email) {
      setError("Please enter a valid email address");
      return;
    }
    await sendOtp(email);
    setShowOtpBox(true);
  };

  function onEmailChange(text: string) {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setError(emailRegex.test(text) ? "" : "Invalid email address");
  }

  const handleOtpSubmit = async () => {
    if (otp.join("").length !== 4) {
      alert("Incomplete OTP");
      return;
    }
    const response = await verifyOtp(otp.join(""));
    alert(response.status ? "Verified Successfully" : "Verification Failed");
    if (response.status) {
      router.push("/(tabs)/calorie");
    }
  };

  const handleChange = (text: string, index: number) => {
    if (!/^[0-9]?$/.test(text)) return; // Allow only numbers
    let newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Calories</Text>
        <Text style={styles.description}>I'm here to help you. Enter your email to continue.</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!showOtpBox}
            value={email}
            onChangeText={onEmailChange}
          />
        </View>
        {error ? <Text style={{ color: "red", marginTop: 5 }}>{error}</Text> : null}
        {showOtpBox && (
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(event) => handleKeyPress(event, index)}
                textAlign="center"
              />
            ))}
          </View>
        )}
        <TouchableOpacity style={styles.button} onPress={showOtpBox ? handleOtpSubmit : handleEmailSubmit}>
          <Text style={styles.buttonText}>{showOtpBox ? "Verify Now" : "Send OTP"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F4F4",
  },
  card: {
    width: 320,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#F5F5F5",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  otpInput: {
    borderBottomWidth: 2,
    borderColor: "#1D1C26",
    fontSize: 18,
    width: 40,
    height: 50,
    marginHorizontal: 5,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
