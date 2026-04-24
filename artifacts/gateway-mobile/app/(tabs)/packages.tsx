import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import {
  ActivityIndicator,
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
const BASE_URL = `https://${process.env.EXPO_PUBLIC_DOMAIN}`;

interface Package {
  id: number;
  nameAr: string;
  nameEn: string;
  durationMonths: number;
  originalPrice: string;
  discountedPrice: string;
  featuresAr: string[];
  featuresEn: string[];
}

function openWhatsApp(pkgName: string, isRTL: boolean) {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  const msg = isRTL
    ? `مرحباً، أود الاستفسار عن ${pkgName}`
    : `Hello, I'd like to inquire about the ${pkgName} package`;
  Linking.openURL(`https://wa.me/${WHATSAPP_SA}?text=${encodeURIComponent(msg)}`);
}

function formatPrice(price: string) {
  const num = parseFloat(price);
  if (isNaN(num)) return price;
  return num.toLocaleString("en-US");
}

export default function PackagesScreen() {
  const colors = useColors();
  const { t, language, isRTL, setLanguage } = useLanguage();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const { data, isLoading, isError, refetch } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/api/packages`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const styles = makeStyles(colors, isRTL);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <View style={[styles.headerTopRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
          <Text style={[styles.headerTitle, { textAlign: isRTL ? "right" : "left", flex: 1 }]}>
            {t("pkg.title")}
          </Text>
          <TouchableOpacity
            style={styles.langToggle}
            onPress={() => {
              Haptics.selectionAsync();
              setLanguage(language === "ar" ? "en" : "ar");
            }}
            testID="button-language-toggle-pkg"
            activeOpacity={0.8}
          >
            <Text style={styles.langToggleText}>{language === "ar" ? "EN" : "عر"}</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.headerSub, { textAlign: isRTL ? "right" : "left" }]}>
          {t("pkg.subtitle")}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.centerText}>{t("pkg.loading")}</Text>
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Feather name="wifi-off" size={40} color={colors.mutedForeground} />
          <Text style={styles.centerText}>{t("pkg.error")}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            padding: 16,
            gap: 16,
            paddingBottom: Platform.OS === "web" ? 84 + 34 : 100,
          }}
          showsVerticalScrollIndicator={false}
        >
          {(data ?? []).map((pkg) => {
            const name = language === "ar" ? pkg.nameAr : pkg.nameEn;
            const features = language === "ar" ? pkg.featuresAr : pkg.featuresEn;
            const hasDiscount =
              pkg.discountedPrice &&
              parseFloat(pkg.discountedPrice) < parseFloat(pkg.originalPrice);

            return (
              <View key={pkg.id} style={styles.pkgCard} testID={`card-package-${pkg.id}`}>
                <View style={styles.pkgHeader}>
                  <View>
                    <Text style={[styles.pkgName, { textAlign: isRTL ? "right" : "left" }]}>
                      {name}
                    </Text>
                    <Text style={[styles.pkgDuration, { textAlign: isRTL ? "right" : "left" }]}>
                      {pkg.durationMonths < 12
                        ? `${pkg.durationMonths} ${isRTL ? "أشهر" : "Months"}`
                        : isRTL
                        ? "سنة كاملة"
                        : "Full Year"}
                    </Text>
                  </View>
                  <View style={styles.priceBox}>
                    {hasDiscount && (
                      <Text style={styles.originalPrice}>
                        {formatPrice(pkg.originalPrice)}
                      </Text>
                    )}
                    <Text style={styles.price}>
                      {formatPrice(hasDiscount ? pkg.discountedPrice : pkg.originalPrice)}
                    </Text>
                    <Text style={styles.currency}>{t("pkg.myr")}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <Text style={[styles.featuresLabel, { textAlign: isRTL ? "right" : "left" }]}>
                  {t("pkg.features")}
                </Text>
                <View style={styles.featuresList}>
                  {(features ?? []).map((feat, i) => (
                    <View
                      key={i}
                      style={[
                        styles.featureItem,
                        { flexDirection: isRTL ? "row-reverse" : "row" },
                      ]}
                    >
                      <Feather name="check-circle" size={15} color={colors.gold} />
                      <Text style={[styles.featureText, { textAlign: isRTL ? "right" : "left" }]}>
                        {feat}
                      </Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.inquireBtn}
                  onPress={() => openWhatsApp(name, isRTL)}
                  testID={`button-inquire-pkg-${pkg.id}`}
                  activeOpacity={0.85}
                >
                  <Feather name="message-circle" size={16} color="#fff" />
                  <Text style={styles.inquireBtnText}>{t("pkg.inquire")}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>, isRTL: boolean) {
  return StyleSheet.create({
    container: { flex: 1 },
    header: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingBottom: 24,
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
      fontSize: 24,
      color: "#fff",
      fontFamily: "Inter_700Bold",
      marginBottom: 6,
    },
    headerSub: {
      fontSize: 14,
      color: "rgba(255,255,255,0.75)",
      fontFamily: "Inter_400Regular",
    },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 12,
    },
    centerText: {
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      fontSize: 15,
    },
    retryBtn: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    retryText: { color: "#fff", fontFamily: "Inter_600SemiBold" },
    pkgCard: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
    },
    pkgHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    pkgName: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 4,
    },
    pkgDuration: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    priceBox: { alignItems: isRTL ? "flex-start" : "flex-end" },
    originalPrice: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textDecorationLine: "line-through",
    },
    price: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: colors.gold,
    },
    currency: {
      fontSize: 11,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginBottom: 12,
    },
    featuresLabel: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 8,
    },
    featuresList: { gap: 6, marginBottom: 16 },
    featureItem: { gap: 8, alignItems: "flex-start" },
    featureText: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      flex: 1,
      lineHeight: 18,
    },
    inquireBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.whatsapp,
      borderRadius: 8,
      paddingVertical: 12,
      gap: 8,
    },
    inquireBtnText: {
      color: "#fff",
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
    },
  });
}
