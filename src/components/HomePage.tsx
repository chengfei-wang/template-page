import { defineComponent } from "vue";

const HomePage = defineComponent({
    name: "HomePage",
    setup() {
        return () => (
            <div>
                <h1>Home Page</h1>
            </div>
        );
    }
});
export default HomePage;