<script src="api.js"></script>

<script>
    apiRequest("/api/health")
        .then(data => {
            console.log("REMADEF API:", data);
        })
        .catch(error => {
            console.error("API Error:", error);
        });
</script>
