import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useQuery } from "@tanstack/react-query";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

import { useLanguage } from "@/context/LanguageContext";
import { useColors } from "@/hooks/useColors";

const WHATSAPP_SA = "966562022668";

interface Institution {
  id: number;
  name: string;
  type: "university" | "language_center";
  description: string;
  location: string;
  imageUrl: string | null;
}

function openWhatsApp(name: string, isRTL: boolean) {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  const msg = isRTL
    ? `مرحباً، أود الاستفسار عن ${name}`
    : `Hello, I'd like to inquire about ${name}`;
  Linking.openURL(`https://wa.me/${WHATSAPP_SA}?text=${encodeURIComponent(msg)}`);
}

const BASE_URL = `https://${process.env.EXPO_PUBLIC_DOMAIN}`;

function resolveImageUrl(imageUrl: string | null): string | null {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http")) return imageUrl;
  return `${BASE_URL}${imageUrl}`;
}

export default function InstitutionsScreen() {
  const colors = useColors();
  const { t, isRTL, language, setLanguage } = useLanguage();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<"all" | "university" | "language_center">("all");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const { data, isLoading, isError, refetch } = useQuery<Institution[]>({
    queryKey: ["/api/institutions"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/api/institutions`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const filtered =
    filter === "all"
      ? data ?? []
      : (data ?? []).filter((i) => i.type === filter);

  const styles = makeStyles(colors, isRTL);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <View style={[styles.headerTopRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
          <Text style={[styles.headerTitle, { textAlign: isRTL ? "right" : "left", flex: 1 }]}>
            {t("inst.title")}
          </Text>
          <TouchableOpacity
            style={styles.langToggle}
            onPress={() => {
              Haptics.selectionAsync();
              setLanguage(language === "ar" ? "en" : "ar");
            }}
            testID="button-language-toggle-inst"
            activeOpacity={0.8}
          >
            <Text style={styles.langToggleText}>{language === "ar" ? "EN" : "عر"}</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.headerSub, { textAlign: isRTL ? "right" : "left" }]}>
          {t("inst.subtitle")}
        </Text>
        <View style={[styles.filterRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
          {(["all", "university", "language_center"] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
              testID={`button-filter-${f}`}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {t(`inst.${f === "all" ? "all" : f === "university" ? "universities" : "language_centers"}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.loadingText}>{t("inst.loading")}</Text>
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Feather name="wifi-off" size={40} color={colors.mutedForeground} />
          <Text style={styles.errorText}>{t("inst.error")}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.center}>
          <Feather name="inbox" size={40} color={colors.mutedForeground} />
          <Text style={styles.errorText}>{t("inst.empty")}</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: Platform.OS === "web" ? 84 + 34 : 100,
            gap: 12,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <InstitutionCard
              item={item}
              colors={colors}
              isRTL={isRTL}
              onInquire={() => openWhatsApp(item.name, isRTL)}
              inquireLabel={t("inst.inquire")}
            />
          )}
        />
      )}
    </View>
  );
}

function InstitutionCard({
  item,
  colors,
  isRTL,
  onInquire,
  inquireLabel,
}: {
  item: Institution;
  colors: ReturnType<typeof useColors>;
  isRTL: boolean;
  onInquire: () => void;
  inquireLabel: string;
}) {
  const imgUrl = resolveImageUrl(item.imageUrl);
  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    img: { width: "100%", height: 140, backgroundColor: colors.muted },
    body: { padding: 14 },
    name: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 4,
      textAlign: isRTL ? "right" : "left",
    },
    desc: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      lineHeight: 18,
      marginBottom: 12,
      textAlign: isRTL ? "right" : "left",
    },
    btn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.whatsapp,
      borderRadius: 8,
      paddingVertical: 10,
      gap: 6,
    },
    btnText: {
      color: "#fff",
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
    },
  });

  return (
    <View style={styles.card}>
      {imgUrl ? (
        <Image source={{ uri: imgUrl }} style={styles.img} contentFit="cover" />
      ) : (
        <View style={[styles.img, { justifyContent: "center", alignItems: "center" }]}>
          <Feather name="image" size={32} color={colors.mutedForeground} />
        </View>
      )}
      <View style={styles.body}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
        <TouchableOpacity style={styles.btn} onPress={onInquire} testID={`button-inquire-${item.id}`} activeOpacity={0.85}>
          <Feather name="message-circle" size={15} color="#fff" />
          <Text style={styles.btnText}>{inquireLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>, isRTL: boolean) {
  return StyleSheet.create({
    container: { flex: 1 },
    header: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingBottom: 20,
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
      marginBottom: 16,
    },
    filterRow: { gap: 8 },
    filterBtn: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      backgroundColor: "rgba(255,255,255,0.15)",
    },
    filterBtnActive: { backgroundColor: colors.gold },
    filterText: {
      fontSize: 13,
      color: "rgba(255,255,255,0.8)",
      fontFamily: "Inter_500Medium",
    },
    filterTextActive: { color: colors.primary, fontFamily: "Inter_600SemiBold" },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 12,
      padding: 24,
    },
    loadingText: {
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      fontSize: 14,
    },
    errorText: {
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      fontSize: 15,
      textAlign: "center",
    },
    retryBtn: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    retryText: { color: "#fff", fontFamily: "Inter_600SemiBold" },
  });
}
