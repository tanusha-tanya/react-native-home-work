import * as Location from "expo-location";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText as Text } from "../../components/ui/AppText";
import { useI18n } from "../../contexts/I18nContext";
import { COLORS } from "../../theme/colors";

export default function ProfileScreen() {
  const { languagePreference, setLanguagePreference, t } = useI18n();
  const [locationText, setLocationText] = useState<string>("");

  const requestLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationText(t("profile.location.denied"));
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocationText(
        t("profile.location.coords", {
          lat: currentLocation.coords.latitude.toFixed(6),
          lng: currentLocation.coords.longitude.toFixed(6),
        })
      );
    } catch {
      setLocationText(t("profile.location.error"));
    }
  };

  const languageOptions = [
    { id: "system", label: t("profile.language.auto") },
    { id: "ru", label: t("profile.language.ru") },
    { id: "en", label: t("profile.language.en") },
    { id: "pt", label: t("profile.language.pt") },
    { id: "es", label: t("profile.language.es") },
    { id: "kk", label: t("profile.language.kk") },
    { id: "be", label: t("profile.language.be") },
    { id: "de", label: t("profile.language.de") },
    { id: "it", label: t("profile.language.it") },
  ] as const;

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{t("profile.title")}</Text>

      <View style={styles.block}>
        <Text style={styles.sectionTitle}>{t("profile.language")}</Text>
        <View style={styles.optionsRow}>
          {languageOptions.map((option) => {
            const active = option.id === languagePreference;
            return (
              <Pressable
                key={option.id}
                onPress={() => setLanguagePreference(option.id)}
                style={[styles.optionButton, active && styles.optionButtonActive]}
              >
                <Text style={[styles.optionText, active && styles.optionTextActive]}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.block}>
        <Text style={styles.sectionTitle}>{t("profile.location.title")}</Text>
        <Pressable onPress={requestLocation} style={styles.locationButton}>
          <Text style={styles.locationButtonText}>{t("profile.location.request")}</Text>
        </Pressable>
        {locationText ? <Text style={styles.locationText}>{locationText}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    backgroundColor: COLORS.background,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  block: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    gap: 12,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  optionsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  optionButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  optionButtonActive: {
    borderColor: COLORS.action,
    backgroundColor: COLORS.actionLight,
  },
  optionText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
  optionTextActive: {
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  locationButton: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.action,
    alignItems: "center",
  },
  locationButtonText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  locationText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
