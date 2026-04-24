import { Feather, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLanguage } from "@/context/LanguageContext";
import { useColors } from "@/hooks/useColors";

const WHATSAPP_SA = "966562022668";
const WHATSAPP_MY = "601129082602";

function openWhatsApp(phone: string, message: string) {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
}

const SERVICES = [
  { iconName: "flight-land" as const, key: "service1" },
  { iconName: "sim-card" as const, key: "service2" },
  { iconName: "local-hospital" as const, key: "service3" },
  { iconName: "school" as const, key: "service4" },
  { iconName: "support-agent" as const, key: "service5" },
  { iconName: "hotel" as const, key: "service6" },
];

export default function HomeScreen() {
  const colors = useColors();
  const { t, isRTL } = useLanguage();
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
        colors={[colors.primary, "#2a4a7f"]}
        style={[styles.hero, { paddingTop: topPad + 24 }]}
      >
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{t("home.badge")}</Text>
          </View>
        </View>
        <Text style={[styles.heroTitle, { textAlign: isRTL ? "right" : "left" }]}>
          {t("home.title")}
        </Text>
        <Text style={[styles.heroSubtitle, { textAlign: isRTL ? "right" : "left" }]}>
          {t("home.subtitle")}
        </Text>
        <TouchableOpacity
          style={styles.whatsappBtn}
          onPress={() => openWhatsApp(WHATSAPP_SA, isRTL ? "مرحباً، أود الاستفسار عن خدماتكم" : "Hello, I'd like to inquire about your services")}
          testID="button-whatsapp-hero"
          activeOpacity={0.85}
        >
          <Feather name="message-circle" size={18} color={colors.primary} />
          <Text style={styles.whatsappBtnText}>{t("home.whatsapp")}</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { textAlign: isRTL ? "right" : "left" }]}>
          {t("home.services_title")}
        </Text>
        <View style={styles.servicesGrid}>
          {SERVICES.map((svc) => (
            <View key={svc.key} style={styles.serviceCard}>
              <View style={styles.serviceIconWrap}>
                <MaterialIcons name={svc.iconName} size={24} color={colors.gold} />
              </View>
              <Text style={[styles.serviceTitle, { textAlign: isRTL ? "right" : "left" }]}>
                {t(`home.${svc.key}_title`)}
              </Text>
              <Text style={[styles.serviceDesc, { textAlign: isRTL ? "right" : "left" }]}>
                {t(`home.${svc.key}_desc`)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>, isRTL: boolean) {
  return StyleSheet.create({
    container: { flex: 1 },
    hero: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    badgeRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      marginBottom: 16,
    },
    badge: {
      backgroundColor: colors.gold,
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 6,
    },
    badgeText: {
      color: colors.primary,
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
    },
    heroTitle: {
      fontSize: 30,
      color: "#fff",
      fontFamily: "Inter_700Bold",
      marginBottom: 12,
      lineHeight: 38,
    },
    heroSubtitle: {
      fontSize: 15,
      color: "rgba(255,255,255,0.82)",
      fontFamily: "Inter_400Regular",
      lineHeight: 24,
      marginBottom: 28,
    },
    whatsappBtn: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.gold,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 20,
      alignSelf: isRTL ? "flex-end" : "flex-start",
      gap: 8,
    },
    whatsappBtnText: {
      color: colors.primary,
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
    },
    section: {
      paddingHorizontal: 16,
      paddingTop: 28,
    },
    sectionTitle: {
      fontSize: 22,
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      marginBottom: 16,
    },
    servicesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    serviceCard: {
      width: "47%",
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    serviceIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.muted,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
    },
    serviceTitle: {
      fontSize: 14,
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
      marginBottom: 4,
    },
    serviceDesc: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      lineHeight: 18,
    },
  });
}
