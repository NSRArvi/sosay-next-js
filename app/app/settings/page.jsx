"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useAppContext } from "@/context/context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithToken, postWithToken } from "@/helpers/api";
import toast from "react-hot-toast";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import SettingsFormSkeleton from "@/components/settings/SettingsFormSkeleton";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { accessToken: token, countries, countriesLoading } = useAppContext();
  const queryClient = useQueryClient();
  const router = useRouter();

  const getProfileCountryId = (p) => {
    if (!p) return "";
    if (p.country_id) return String(p.country_id);
    if (p.country?.id) return String(p.country.id);
    return "";
  };

  const { data, isLoading: profileLoading } = useQuery({
    queryKey: ["/settings/profile", token],
    queryFn: fetchWithToken,
    enabled: !!token,
  });

  const profile = data?.data || null;

  const countryOptions = useMemo(() => {
    const list = Array.isArray(countries) ? countries : [];
    const hasCurrentCountry = list.some(
      (c) => String(c?.id) === String(profile?.country?.id),
    );

    if (profile?.country?.id && profile?.country?.name && !hasCurrentCountry) {
      return [
        ...list,
        {
          id: profile.country.id,
          name: profile.country.name,
        },
      ];
    }

    return list;
  }, [countries, profile]);

  const [draft, setDraft] = useState({});

  const form = useMemo(
    () => ({
      name: draft.name ?? profile?.name ?? "",
      phone_number: draft.phone_number ?? profile?.phone_number ?? "",
      whatsapp_number: draft.whatsapp_number ?? profile?.whatsapp_number ?? "",
      dob: draft.dob ?? profile?.dob ?? "",
      gender: draft.gender ?? profile?.gender ?? "",
      address: draft.address ?? profile?.address ?? "",
      country_id: draft.country_id ?? getProfileCountryId(profile),
    }),
    [draft, profile],
  );

  useEffect(() => {
    if (!profileLoading && profile && profile.is_verified === false) {
      router.push("/app/verify");
    }
  }, [profileLoading, profile, router]);

  const mutation = useMutation({
    mutationFn: (formData) =>
      postWithToken("/settings/profile", formData, token),
    onSuccess: (res) => {
      if (res?.status === true) {
        toast.success(res.message || "Settings updated");
        queryClient.invalidateQueries({
          queryKey: ["/settings/profile", token],
        });
        if (res.data) {
          queryClient.setQueryData(["/settings/profile", token], {
            status: true,
            data: res.data,
          });
        }
        setDraft({});
      } else {
        toast.error(res?.message || "Failed to update settings");
      }
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to update settings");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDraft((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token) return;

    const fd = new FormData();
    if (form.name) fd.append("name", form.name);
    if (form.phone_number) fd.append("phone_number", form.phone_number);
    if (form.whatsapp_number)
      fd.append("whatsapp_number", form.whatsapp_number);
    if (form.dob) fd.append("dob", form.dob);
    if (form.gender) fd.append("gender", form.gender);
    if (form.address) fd.append("address", form.address);
    if (form.country_id) fd.append("country_id", form.country_id);

    mutation.mutate(fd);
  };

  if (!token)
    return <div className="p-4">You must be logged in to access settings.</div>;

  if (profileLoading) return <SettingsFormSkeleton />;

  if (profile && profile.is_verified === false) {
    return (
      <div className="p-6 flex items-center justify-center text-sm text-muted-foreground">
        <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Redirecting to
        verification...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-6 py-8 mt-14 bg-white border rounded-xl">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-2xl font-semibold">Profile Settings</h2>
        {profile?.is_verified ? (
          <div className="inline-flex items-center gap-1 rounded-full bg-secondary/10 text-secondary px-3 py-1 text-xs font-medium">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified
          </div>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm">Name</Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Email</Label>
          <Input
            value={profile?.email || ""}
            readOnly
            className="h-10 bg-muted/40"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm">Phone number</Label>
            <Input
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">WhatsApp number</Label>
            <Input
              name="whatsapp_number"
              value={form.whatsapp_number}
              onChange={handleChange}
              className="h-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm">Date of birth</Label>
            <Input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Gender</Label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border bg-transparent px-3 py-2 text-sm"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Country</Label>
            <Select
              value={form.country_id}
              onValueChange={(v) => setDraft((s) => ({ ...s, country_id: v }))}
              disabled={countriesLoading || countryOptions.length === 0}
            >
              <SelectTrigger className="w-full h-10 text-sm">
                <SelectValue
                  placeholder={
                    countriesLoading ? "Loading countries..." : "Select Country"
                  }
                />
              </SelectTrigger>
              <SelectContent className="max-h-[280px]">
                {countryOptions.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Address</Label>
          <Input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="h-10"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            variant="default"
            size="default"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin text-white" />{" "}
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
