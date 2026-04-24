import { Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLanguage } from "@/context/LanguageContext";
import { useColors } from "@/hooks/useColors";

const WHATSAPP_SA = "966562022668";
const WHATSAPP_MY = "601129082602";

function openWhatsApp(phone: string, isRTL: boolean) {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  const msg = isRTL
    ? "مرحباً، أود الاستفسار عن خدماتكم"
    : "Hello, I'd like to inquire about your services";
  Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
}

export default function ContactScreen() {
  const colors = useColors();
  const { t, isRTL, language, setLanguage } = useLanguage();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const styles = makeStyles(colors, isRTL);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 84 + 34 : 100 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[colors.primary, colors.foreground]}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <View style={[styles.headerTopRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
          <Text style={[styles.headerTitle, { textAlign: isRTL ? "right" : "left", flex: 1 }]}>
            {t("contact.title")}
          </Text>
          <TouchableOpacity
            style={styles.langToggle}
            onPress={() => {
              Haptics.selectionAsync();
              setLanguage(language === "ar" ? "en" : "ar");
            }}
            testID="button-language-toggle-contact"
            activeOpacity={0.8}
          >
            <Text style={styles.langToggleText}>{language === "ar" ? "EN" : "عر"}</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.headerSub, { textAlign: isRTL ? "right" : "left" }]}>
          {t("contact.subtitle")}
        </Text>
      </LinearGradient>

      <View style={styles.section}>
        <View style={styles.countrySection}>
          <View style={styles.countryHeader}>
            <Text style={styles.flag}>🇸🇦</Text>
            <Text style={[styles.countryLabel, { textAlign: isRTL ? "right" : "left" }]}>
              {t("contact.saudi")}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.whatsappBtn}
            onPress={() => openWhatsApp(WHATSAPP_SA, isRTL)}
            testID="button-whatsapp-sa"
            activeOpacity={0.85}
          >
            <FontAwesome5 name="whatsapp" size={20} color="#fff" />
            <View style={styles.btnTextWrap}>
              <Text style={styles.whatsappLabel}>{t("contact.whatsapp_sa")}</Text>
              <Text style={styles.whatsappNumber}>+966 56 202 2668</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.countrySection}>
          <View style={styles.countryHeader}>
            <Text style={styles.flag}>🇲🇾</Text>
            <Text style={[styles.countryLabel, { textAlign: isRTL ? "right" : "left" }]}>
              {t("contact.malaysia")}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.whatsappBtn, { backgroundColor: "#128C7E" }]}
            onPress={() => openWhatsApp(WHATSAPP_MY, isRTL)}
            testID="button-whatsapp-my"
            activeOpacity={0.85}
          >
            <FontAwesome5 name="whatsapp" size={20} color="#fff" />
            <View style={styles.btnTextWrap}>
              <Text style={styles.whatsappLabel}>{t("contact.whatsapp_my")}</Text>
              <Text style={styles.whatsappNumber}>+60 11-2908 2602</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.followSection}>
          <Text style={[styles.followTitle, { textAlign: isRTL ? "right" : "left" }]}>
            {t("contact.follow")}
          </Text>
          <View style={[styles.socialRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <TouchableOpacity
              style={[styles.socialBtn, { backgroundColor: "#000" }]}
              onPress={() => Linking.openURL("https://www.tiktok.com/@gatewayservices.ma")}
              testID="button-tiktok"
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name="music-note" size={20} color="#fff" />
              <Text style={styles.socialLabel}>{t("contact.tiktok")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialBtn, { backgroundColor: "#E1306C" }]}
              onPress={() => Linking.openURL("https://www.instagram.com/gateway.services.ma")}
              testID="button-instagram"
              activeOpacity={0.85}
            >
              <Feather name="instagram" size={20} color="#fff" />
              <Text style={styles.socialLabel}>{t("contact.instagram")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>, isRTL: boolean) {
  return StyleSheet.create({
    container: { flex: 1 },
    header: {
      paddingHorizontal: 20,
      paddingBottom: 28,
    },
    headerTopRow: {
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
      gap: 8,
    },
    langToggle: {
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.3)",
    },
    langToggleText: {
      color: "#fff",
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
    },
    headerTitle: {
      fontSize: 28,
      color: "#fff",
      fontFamily: "Inter_700Bold",
      marginBottom: 8,
    },
    headerSub: {
      fontSize: 15,
      color: "rgba(255,255,255,0.75)",
      fontFamily: "Inter_400Regular",
    },
    section: { padding: 16, gap: 20 },
    countrySection: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      gap: 12,
    },
    countryHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 10,
    },
    flag: { fontSize: 24 },
    countryLabel: {
      fontSize: 17,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    whatsappBtn: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      backgroundColor: colors.whatsapp,
      borderRadius: 10,
      paddingVertical: 14,
      paddingHorizontal: 16,
      gap: 12,
    },
    btnTextWrap: { flex: 1, alignItems: isRTL ? "flex-end" : "flex-start" },
    whatsappLabel: {
      color: "#fff",
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
    },
    whatsappNumber: {
      color: "rgba(255,255,255,0.85)",
      fontSize: 13,
      fontFamily: "Inter_400Regular",
    },
    followSection: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      gap: 12,
    },
    followTitle: {
      fontSize: 17,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    socialRow: { gap: 12 },
    socialBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      paddingVertical: 14,
      gap: 8,
    },
    socialLabel: {
      color: "#fff",
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
    },
  });
}
