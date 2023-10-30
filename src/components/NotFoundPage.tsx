import { defineComponent } from "vue";

const NotFoundPage = defineComponent({
  name: "NotFoundPage",
  setup() {
    return () => (
      <div>
        <h1>Page not found</h1>
      </div>
    )
  }
});

export default NotFoundPage;