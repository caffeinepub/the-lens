interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  // Split description into lines and process
  const lines = description.split('\n').filter((line) => line.trim());

  return (
    <div className="space-y-3">
      {lines.map((line, index) => {
        const trimmedLine = line.trim();
        
        // Check if line is a key-value pair (contains colon)
        if (trimmedLine.includes(':')) {
          const [key, ...valueParts] = trimmedLine.split(':');
          const value = valueParts.join(':').trim();
          
          return (
            <div key={index} className="flex gap-2">
              <span className="font-medium text-foreground min-w-fit">{key.trim()}:</span>
              <span className="text-muted-foreground">{value}</span>
            </div>
          );
        }
        
        // Regular line (heading or plain text)
        return (
          <p key={index} className="text-muted-foreground leading-relaxed">
            {trimmedLine}
          </p>
        );
      })}
    </div>
  );
}
