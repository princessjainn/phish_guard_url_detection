from model import PhishGuardModel
import sys

if __name__ == '__main__':
    print("🚀 phishguard training starting...")
    print("this might take a minute ngl\n")
    
    model = PhishGuardModel()
    
    sample_size = 50000
    if len(sys.argv) > 1:
        try:
            sample_size = int(sys.argv[1])
        except:
            pass
    
    print(f"training on {sample_size} samples from dataset\n")
    
    try:
        accuracy = model.train_on_dataset(sample_size=sample_size)
        print(f"\n✅ training complete!")
        print(f"test accuracy: {accuracy*100:.2f}%")
        print("\nmodel saved! you can now run the api ✨")
    except Exception as e:
        print(f"\n❌ training failed: {e}")
        sys.exit(1)
